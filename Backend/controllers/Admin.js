import Auth from '../models/Auth.js'
import mangoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import "dotenv/config";







export async function loginAdmin(req, res) {
    try {
        const data = req.body;
        const admin = await Auth.findOne({ email: data.email });

        if (!admin) {
            return res.status(404).json({ message: "Email not found" });
        }

        const doesPasswordMatch = await bcrypt.compare(data.password, admin.password);

        if (!doesPasswordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // 🚫 BLOCK USER → Only allow admin
        if (admin.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const admin_token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie("admin_token", admin_token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 3600000
        });

        return res.status(200).json({ message: "Admin Login successful" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export async function logoutAdmin(req, res) {
    try {
        // Clear the admin token cookie
        res.clearCookie("admin_token", {
            httpOnly: true,
            secure: true,      // true only in production
            sameSite: "none"
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}




export async function updateAdmin(req, res) { }
