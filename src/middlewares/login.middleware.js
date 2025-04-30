import jwt from "jsonwebtoken";
export const isLoggedIn = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(200).json({
            success: false,
            message: "cookie not found",
        });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded)
        return res.status(401).json({
            success: false,
            message: "Invalid cookie",
        });

    next();
};
