import jwt from "jsonwebtoken";


export const isOwner = (req, res, next) => {
    if (req.user?.role === "owner") {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Owner access required",
    });
};
