import Auth from "../models/Auth.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { getCookieOptions, getRequiredEnv } from "../utils/authConfig.js";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
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

export async function getAdminUsers(req, res) {
  try {
    const users = await Auth.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/* ======================
   ADMIN LOGIN
====================== */
export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const admin = await Auth.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (admin.isBlocked) {
      return res.status(403).json({ message: "This account is blocked" });
    }

    if (!admin.password) {
      return res.status(400).json({
        message: "This account does not support password login",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const adminToken = jwt.sign(
      { id: admin._id, role: admin.role },
      getRequiredEnv("JWT_SECRET"),
      { expiresIn: "1d" }
    );

    res.cookie("admin_token", adminToken, {
      ...getCookieOptions(req),
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Admin login successful",
      ...buildSessionResponse(admin, adminToken),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/* ======================
   ADMIN LOGOUT
====================== */
export async function logoutAdmin(req, res) {
  try {
    res.clearCookie("admin_token", getCookieOptions(req));

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User id is required" });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await Auth.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin users cannot be deleted" });
    }

    await Auth.findByIdAndDelete(id);

    return res.status(200).json({
      message: "User deleted successfully",
      deletedUserId: id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/* ======================
   BLOCK / UNBLOCK USER
====================== */
export async function toggleBlockUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User id is required" });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await Auth.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot block admin" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.status(200).json({
      message: user.isBlocked ? "User blocked" : "User unblocked",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
