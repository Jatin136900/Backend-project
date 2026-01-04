import Auth from '../models/Auth.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import "dotenv/config";
import axios from "axios";


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


        const isProd = process.env.NODE_ENV === "production";

        res.cookie("auth_token", auth_token, {
            httpOnly: true,
            secure: isProd,              // localhost → false
            sameSite: isProd ? "none" : "lax",
            maxAge: 3 * 60 * 60 * 1000,
        });


        return res.status(200).json({ message: "Login Successful" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function logoutUsers(req, res) {
    try {
        const isProd = process.env.NODE_ENV === "production";

        res.clearCookie("auth_token", {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
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






export async function githubLogin(req, res) {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ message: "Code missing" });
        }

        // 1️⃣ code → access token
        const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: "application/json" } }
        );

        const accessToken = tokenRes.data.access_token;
        if (!accessToken) {
            return res.status(400).json({ message: "No access token" });
        }

        // 2️⃣ GitHub user
        const userRes = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        // 3️⃣ Email fetch (IMPORTANT)
        const emailRes = await axios.get(
            "https://api.github.com/user/emails",
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        const primaryEmail =
            emailRes.data.find(e => e.primary)?.email ||
            `${userRes.data.id}@github.local`;

        // 4️⃣ Find or create user
        let user = await Auth.findOne({ email: primaryEmail });

        if (!user) {
            user = await Auth.create({
                name: userRes.data.name || "GitHub User",
                email: primaryEmail,
                avatar: userRes.data.avatar_url,
                role: "user",
                provider: "github",
            });
        }

        // 5️⃣ JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(200).json({ message: "GitHub login successful" });

    } catch (error) {
        console.error("GitHub Login Error:", error.message);
        return res.status(500).json({ message: "GitHub login failed" });
    }
}


// export async function checkLogin(req, res) {
//     try {
//         const token = req.cookies.auth_token;

//         if (!token) {
//             return res.status(401).json({ loggedIn: false });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await Auth.findById(decoded.id).select("-password");

//         if (!user) {
//             return res.status(401).json({ loggedIn: false });
//         }

//         return res.status(200).json({
//             loggedIn: true,
//             user,
//         });
//     } catch (error) {
//         return res.status(401).json({ loggedIn: false });
//     }
// }




export async function updateUsers(req, res) { }



