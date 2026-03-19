import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Auth from "../models/Auth.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function getUserCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  };
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
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, sub } = ticket.getPayload();

    let user = await Auth.findOne({ email });

    if (user?.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact the admin.",
      });
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
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", authToken, {
      ...getUserCookieOptions(),
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login success",
      ...buildSessionResponse(user, authToken),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
