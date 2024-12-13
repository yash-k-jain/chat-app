const jwt = require("jsonwebtoken");

const User = require("../../models/user.model.js")

const protectedRoute = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const verify = jwt.verify(token, process.env.JWT_SECRET);
        if (!verify) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        const user = await User.findOne({ _id: verify.userId });
        if (!user) {
            return res.status(401).json({ error: "No User Found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = protectedRoute