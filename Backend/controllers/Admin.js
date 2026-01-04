import Auth from '../models/Auth.js'
import mangoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import "dotenv/config";







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
            { expiresIn: "9h" }
        );

        const isProd = process.env.NODE_ENV === 'production';
        res.cookie("admin_token", admin_token, {
            httpOnly: true,
            secure: isProd,               // ✔ true in production; localhost may be treated as secure in modern browsers
            sameSite: isProd ? "none" : "lax", // ✔ use None for cross-site in production
            maxAge: 9 * 60 * 60 * 1000
        });

        return res.status(200).json({ message: "Admin Login successful" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



export async function logoutAdmin(req, res) {
    try {
        res.clearCookie("admin_token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}




export async function updateAdmin(req, res) { }
