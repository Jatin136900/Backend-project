import jwt from "jsonwebtoken"
import "dotenv/config"

export async function checkAuth(req, res, next) {
    try {
        const token = req.cookies.auth_token;
        if (!token) {
            return res.status(401).json({ message: "you need to log in to perform this action" })
        }
        console.log("Secret", process.env.JWT_SECRET)

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


export async function checkForlogin(req, res) {
    try {
        const { referer } = req.query;

        if (!referer) {
            return res.status(422).json({
                message: "no referer query parameter, access denied"
            });
        }

        let token;

        if (referer === "admin") token = req.cookies.admin_token;
        if (referer === "user") token = req.cookies.auth_token;

        if (!token) {
            return res.status(401).json({ message: "no authentication token, access denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== referer) {
            return res.status(403).json({ message: "role mismatch, access denied" });
        }

        return res.status(200).json({ message: "token verified" });

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}


export function checkAdmin(req, res, next) {
    try {
        const token = req.cookies.admin_token;

        if (!token) {
            return res.status(401).json({ message: "Admin login required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Admins only" });
        }

        req.adminId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid admin token" });
    }
}
