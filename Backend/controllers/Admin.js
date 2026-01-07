import Auth from '../models/Auth.js'
import mangoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import "dotenv/config";

/* ======================
   ADMIN LOGIN
====================== */
export async function loginAdmin(req, res) {
    try {
        const { email, password } = req.body;

        const admin = await Auth.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Email not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        if (admin.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const admin_token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("admin_token", admin_token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: "Admin login successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

/* ======================
   ADMIN LOGOUT
====================== */
export async function logoutAdmin(req, res) {
    try {
        res.clearCookie("admin_token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(200).json({ message: "Logout successful" });
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
        

        const user = await Auth.findById(id);
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🚫 Admin ko block mat karna
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
