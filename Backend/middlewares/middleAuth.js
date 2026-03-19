import jwt from "jsonwebtoken";
import "dotenv/config";
import Auth from "../models/Auth.js";
import { getCookieOptions } from "../utils/authConfig.js";

const ROLE_COOKIE_MAP = {
  user: "auth_token",
  admin: "admin_token",
};

function clearCookie(req, res, cookieName) {
  res.clearCookie(cookieName, getCookieOptions(req));
}

function getCookieName(role) {
  return ROLE_COOKIE_MAP[role];
}

function buildSessionPayload(user, decoded) {
  return {
    user: {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    },
    expiresAt: decoded?.exp
      ? new Date(decoded.exp * 1000).toISOString()
      : null,
  };
}

async function getVerifiedUser(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await Auth.findById(decoded.id).select(
    "_id role isBlocked name email"
  );

  return { decoded, user };
}

async function validateSession(req, res, role) {
  const cookieName = getCookieName(role);
  const token = req.cookies[cookieName];

  if (!token) {
    return {
      ok: false,
      status: 401,
      message:
        role === "admin" ? "Admin login required" : "Login required",
      cookieName,
    };
  }

  try {
    const { decoded, user } = await getVerifiedUser(token);

    if (!user) {
      clearCookie(req, res, cookieName);
      return {
        ok: false,
        status: 401,
        message: "User not found",
        cookieName,
      };
    }

    if (decoded.role !== role || user.role !== role) {
      clearCookie(req, res, cookieName);
      return {
        ok: false,
        status: 403,
        message: `Access denied. ${role} only.`,
        cookieName,
      };
    }

    if (user.isBlocked) {
      clearCookie(req, res, cookieName);
      return {
        ok: false,
        status: 403,
        message:
          role === "admin"
            ? "This account is blocked"
            : "Your account has been blocked. Please contact the admin.",
        cookieName,
      };
    }

    return {
      ok: true,
      decoded,
      user,
      cookieName,
    };
  } catch (error) {
    const isJwtError =
      error.name === "TokenExpiredError" || error.name === "JsonWebTokenError";

    if (isJwtError) {
      clearCookie(req, res, cookieName);
      return {
        ok: false,
        status: 401,
        message: "Invalid or expired token",
        cookieName,
      };
    }

    return {
      ok: false,
      status: 500,
      message: error.message,
      cookieName,
    };
  }
}

function createRoleMiddleware(role) {
  return async function roleMiddleware(req, res, next) {
    const result = await validateSession(req, res, role);

    if (!result.ok) {
      return res.status(result.status).json({
        message: result.message,
        authError: true,
      });
    }

    req.auth = {
      id: result.decoded.id,
      role: result.user.role,
      user: result.user,
    };

    if (role === "admin") {
      req.adminId = result.decoded.id;
    } else {
      req.userId = result.decoded.id;
    }

    next();
  };
}

export async function checkForlogin(req, res) {
  try {
    const referer = req.query.referer || req.query.refresh;

    if (!referer || !ROLE_COOKIE_MAP[referer]) {
      return res.status(422).json({
        message: "Invalid role query parameter, access denied",
      });
    }

    const result = await validateSession(req, res, referer);

    if (!result.ok) {
      return res.status(result.status).json({
        message: result.message,
        authError: true,
      });
    }

    return res.status(200).json({
      message: "token verified",
      ...buildSessionPayload(result.user, result.decoded),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const checkAuth = createRoleMiddleware("user");
export const checkAdmin = createRoleMiddleware("admin");
