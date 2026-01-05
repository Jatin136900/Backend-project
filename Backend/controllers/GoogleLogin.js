import { OAuth2Client } from "google-auth-library";
import Auth from "../models/Auth.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, sub } = ticket.getPayload();

    let user = await Auth.findOne({ email });

    if (!user) {
      // ✅ REGISTER NEW GOOGLE USER WITH ROLE
      user = await Auth.create({
        name,
        email,
        googleId: sub,
        image: picture,
        authProvider: "google",
        role: "user",        // ✅ DEFAULT ROLE
      });
    }

    // ✅ LOGIN TOKEN (ROLE INCLUDED)
    const authToken = jwt.sign(
      {
        id: user._id,
        role: user.role,     // ✅ ROLE ADDED
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login success",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
