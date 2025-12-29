import Auth from '../models/Auth.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import "dotenv/config";

export async function getUsers(req, res) {

    try {
        const users = await Auth.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        else {
            return res.status(200).json(users);
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export async function loginUsers(req, res) {
    try {
        const data = req.body;
        const user = await Auth.findOne({ email: data.email });

        if (!user) {
            return res.status(404).json({ message: "Email not Found" });
        }

        const doesPasswordMatch = await bcrypt.compare(data.password, user.password);

        if (!doesPasswordMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // 🚫 BLOCK ADMIN → Only allow normal user
        if (user.role !== 'user') {
            return res.status(403).json({ message: "Access denied. User only." });
        }

        const auth_token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        );

        res.cookie("auth_token", auth_token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600000,
        });

        return res.status(200).json({ message: "Login Successful" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function logoutUsers(req, res) {
    try {
        res.clearCookie("auth_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res.status(200).json({
            message: "User Logout successful"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export async function registerUser(req, res) {
    try {
        const data = req.body;

        // check for email
        const emailExists = await Auth.findOne({ email: data.email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // check for username
        const usernameExists = await Auth.findOne({ username: data.username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // check for phone
        const phoneExists = await Auth.findOne({ phone: data.phone });
        if (phoneExists) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        // assign default role
        data.role = "user";   // 🔥 MOST IMPORTANT LINE

        // hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        const newUser = new Auth(data);
        await newUser.save();

        return res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}


export async function deleteUsers(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const userDeleted = await Auth.findByIdAndDelete(id);

        if (!userDeleted) {
            return res.status(404).json({ message: "user with this id not found" });
        }

        return res.status(200).json({ message: "user deleted" });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}
export async function updateUsers(req, res) { }