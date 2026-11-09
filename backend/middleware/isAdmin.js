import User from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!adminEmail) {
      return res.status(500).json({ success: false, message: "Admin access is not configured on the server." });
    }

    const user = await User.findById(req.user?.id).select("email");
    if (!user || user.email.toLowerCase() !== adminEmail) {
      return res.status(403).json({ success: false, message: "Admin access required." });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    return res.status(500).json({ success: false, message: "Unable to verify admin access." });
  }
};
