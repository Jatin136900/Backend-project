import Auth from "../models/Auth.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import axios from "axios";
import {
    getCookieOptions,
    getRequiredEnv,
    getSafeGithubRedirectUri,
    resolveFrontendUrl,
} from "../utils/authConfig.js";

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

export async function getUsers(req, res) {
    try {
        const users = await Auth.find();

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

export async function loginUsers(req, res) {
    try {
        const data = req.body || {};

        if (!data.email || !data.password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await Auth.findOne({ email: data.email });

        if (!user) {
            return res.status(404).json({ message: "Email not Found" });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                message: "Your account has been blocked. Please contact the admin.",
            });
        }

        if (!user.password) {
            return res.status(400).json({
                message: "This account uses social login. Continue with Google or GitHub.",
            });
        }

        const doesPasswordMatch = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!doesPasswordMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        if (user.role !== "user") {
            return res.status(403).json({ message: "Access denied. User only." });
        }

        const authToken = jwt.sign(
            { id: user._id, role: user.role },
            getRequiredEnv("JWT_SECRET"),
            { expiresIn: "3h" }
        );

        res.cookie("auth_token", authToken, getCookieOptions(req, {
            maxAge: 3 * 60 * 60 * 1000,
        }));

        return res.status(200).json({
            message: "Login successful",
            ...buildSessionResponse(user, authToken),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function logoutUsers(req, res) {
    try {
        res.clearCookie("auth_token", getCookieOptions(req));

        return res.status(200).json({
            message: "User Logout successful",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function registerUser(req, res) {
    try {
        const data = req.body;

        const emailExists = await Auth.findOne({ email: data.email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const usernameExists = await Auth.findOne({ username: data.username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const phoneExists = await Auth.findOne({ phone: data.phone });
        if (phoneExists) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        data.role = "user";
        data.password = await bcrypt.hash(data.password, 10);

        const newUser = new Auth(data);
        await newUser.save();

        return res.status(201).json({
            message: "User registered successfully.",
            user: newUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
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
            error: error.message,
        });
    }
}

export async function githubLogin(req, res) {
    try {
        const { code, redirectUri } = req.body || {};

        if (!code) {
            return res.status(400).json({ message: "Code missing" });
        }

        const githubRedirectUri = getSafeGithubRedirectUri(redirectUri);
        const tokenPayload = new URLSearchParams({
            client_id: getRequiredEnv("GITHUB_CLIENT_ID"),
            client_secret: getRequiredEnv("GITHUB_CLIENT_SECRET"),
            code,
            redirect_uri: githubRedirectUri,
        });

        const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            tokenPayload.toString(),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const accessToken = tokenRes.data.access_token;
        if (!accessToken) {
            return res.status(400).json({ message: "No access token" });
        }

        const userRes = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github+json",
            },
        });

        const emailRes = await axios.get("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github+json",
            },
        });

        const primaryEmail =
            emailRes.data.find((entry) => entry.primary && entry.verified)?.email ||
            emailRes.data.find((entry) => entry.verified)?.email ||
            `${userRes.data.id}@github.local`;

        let user = await Auth.findOne({ email: primaryEmail });

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
                name: userRes.data.name || userRes.data.login || "GitHub User",
                email: primaryEmail,
                image: userRes.data.avatar_url,
                githubId: String(userRes.data.id),
                role: "user",
                authProvider: "github",
            });
        } else {
            let needsSave = false;

            if (!user.githubId) {
                user.githubId = String(userRes.data.id);
                needsSave = true;
            }

            if (!user.image && userRes.data.avatar_url) {
                user.image = userRes.data.avatar_url;
                needsSave = true;
            }

            if (user.authProvider === "local" && !user.password) {
                user.authProvider = "github";
                needsSave = true;
            }

            if (needsSave) {
                await user.save();
            }
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            getRequiredEnv("JWT_SECRET"),
            { expiresIn: "7d" }
        );

        res.cookie("auth_token", token, getCookieOptions(req, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }));

        return res.status(200).json({
            message: "GitHub login successful",
            ...buildSessionResponse(user, token),
        });
    } catch (error) {
        console.error("GitHub Login Error:", error.response?.data || error.message);
        return res.status(500).json({
            message: error.message || "GitHub login failed",
        });
    }
}

export async function verifyEmail(req, res) {
    try {
        const { token } = req.query;

        const user = await Auth.findOne({
            emailVerifyToken: token,
            emailVerifyExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).send("Invalid or expired verification link");
        }

        user.isVerified = true;
        user.emailVerifyToken = undefined;
        user.emailVerifyExpiry = undefined;

        await user.save();

        res.redirect(resolveFrontendUrl("/login"));
    } catch (error) {
        console.error("Verify Email Error:", error);
        res.status(500).send("Server error");
    }
}

export async function updateUsers(req, res) {}
