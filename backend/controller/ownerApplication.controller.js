import OwnerApplication from "../models/ownerApplication.model.js";
import User from "../models/user.model.js";

export const submitOwnerApplication = async (req, res) => {
  try {
    const { hotelName, phone, hotelAddress, message = "" } = req.body;
    if (!hotelName?.trim() || !phone?.trim() || !hotelAddress?.trim()) {
      return res.status(400).json({ success: false, message: "Hotel name, contact number and address are required." });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "Account not found." });
    if (user.role === "owner") {
      return res.status(409).json({ success: false, message: "This account is already an approved hotel owner." });
    }

    const existing = await OwnerApplication.findOne({ user: user._id, status: "pending" });
    if (existing) {
      return res.status(409).json({ success: false, message: "You already have an application awaiting review." });
    }

    const application = await OwnerApplication.create({
      user: user._id,
      hotelName: hotelName.trim(),
      phone: phone.trim(),
      hotelAddress: hotelAddress.trim(),
      message: message.trim(),
    });

    return res.status(201).json({ success: true, message: "Application submitted. You can continue using StayNest while it is reviewed.", application });
  } catch (error) {
    console.error("Owner application submission error:", error);
    return res.status(500).json({ success: false, message: "Unable to submit your application." });
  }
};

export const getOwnerApplications = async (req, res) => {
  try {
    const applications = await OwnerApplication.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Fetch owner applications error:", error);
    return res.status(500).json({ success: false, message: "Unable to load applications." });
  }
};

export const reviewOwnerApplication = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be approved or rejected." });
    }

    const application = await OwnerApplication.findById(req.params.applicationId);
    if (!application) return res.status(404).json({ success: false, message: "Application not found." });
    if (application.status !== "pending") {
      return res.status(409).json({ success: false, message: "This application has already been reviewed." });
    }

    if (status === "approved") {
      const applicant = await User.findById(application.user);
      if (!applicant) return res.status(404).json({ success: false, message: "Applicant account no longer exists." });
      applicant.role = "owner";
      await applicant.save();
    }

    application.status = status;
    application.reviewedAt = new Date();
    await application.save();

    return res.status(200).json({
      success: true,
      message: status === "approved" ? "Application approved. The applicant can now access the owner dashboard." : "Application rejected.",
      application,
    });
  } catch (error) {
    console.error("Review owner application error:", error);
    return res.status(500).json({ success: false, message: "Unable to review this application." });
  }
};
