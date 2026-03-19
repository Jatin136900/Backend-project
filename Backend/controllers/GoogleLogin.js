import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Auth from "../models/Auth.js";
import { getCookieOptions, getRequiredEnv } from "../utils/authConfig.js";

function getGoogleClient() {
  return new OAuth2Client(getRequiredEnv("GOOGLE_CLIENT_ID"));
}

function buildSessionResponse(user, token) {
  const decoded = jwt.decode(token);

  return {
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    expiresAt: decoded?.exp
      ? new Date(decoded.exp * 1000).toISOString()
      : null,
  };
}

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body || {};

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    const googleClientId = getRequiredEnv("GOOGLE_CLIENT_ID");
    const client = getGoogleClient();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: "Unable to read Google account details" });
    }

    const { email, name, picture, sub } = payload;

    let user = await Auth.findOne({ email });

    if (user?.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact the admin.",
      });
    }

    if (user && user.role !== "user") {
      return res.status(403).json({ message: "Access denied. User only." });
    }

    if (!user) {
      user = await Auth.create({
        name,
        email,
        googleId: sub,
        image: picture,
        authProvider: "google",
        role: "user",
      });
    } else {
      let needsSave = false;

      if (!user.googleId) {
        user.googleId = sub;
        needsSave = true;
      }

      if (!user.image && picture) {
        user.image = picture;
        needsSave = true;
      }

      if (user.authProvider === "local" && !user.password) {
        user.authProvider = "google";
        needsSave = true;
      }

      if (needsSave) {
        await user.save();
      }
    }

    if (!user.role) {
      user.role = "user";
      await user.save();
    }

    const authToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      getRequiredEnv("JWT_SECRET"),
      { expiresIn: "1d" }
    );

    res.cookie(
      "auth_token",
      authToken,
      getCookieOptions(req, {
        maxAge: 24 * 60 * 60 * 1000,
      })
    );

    return res.status(200).json({
      message: "Login success",
      ...buildSessionResponse(user, authToken),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
