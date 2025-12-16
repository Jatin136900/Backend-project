import jwt from "jsonwebtoken"
import "dotenv/config"

export async function checkAuth(req, res, next) {
    try {
        const token = req.cookies.auth_token;
        if (!token) {
            return res.status(401).json({ message: "you need to log in to perform this action" })
        }

        const decoded = jwt.verify(token, process.env.JWT_secret);
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


export async function checkForlogin(req, res) {
    try {
        if (!req.query)
            return res.status(422).json({
                message: "no referer query parameter, access denied"
            })

        let token;

        if (req.query.referer === "admin") token = req.cookies.admin_token;
        if (req.query.referer === "user") token = req.cookies.auth_token;

        if (!token) {
            return res.status(401).json({ message: "no authentication token, accesss denied" })
        }

        const decoded = jwt.verify(token, process.env.JWT_secret)
        if (decoded.role === req.query.referer)
            return res.status(200).json({ message: "token verified" })
    }

    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}