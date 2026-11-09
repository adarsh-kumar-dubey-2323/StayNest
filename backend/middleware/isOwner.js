import User from "../models/user.model.js";

export const isOwner = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?.id).select("role");
    if (user?.role === "owner") return next();
    return res.status(403).json({ success: false, message: "Approved hotel-owner access required." });
  } catch (error) {
    console.error("Owner authorization error:", error);
    return res.status(500).json({ success: false, message: "Unable to verify owner access." });
  }
};
