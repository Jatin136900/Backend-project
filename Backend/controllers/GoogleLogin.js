export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, sub } = ticket.getPayload();

    let user = await Auth.findOne({ email });

    // 🆕 REGISTER
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

    // 🛠️ FIX OLD GOOGLE USERS (ROLE MISSING)
    if (!user.role) {
      user.role = "user";
      await user.save();
    }

    // 🔐 TOKEN WITH ROLE
    const authToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login success",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
