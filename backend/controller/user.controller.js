import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email.js";

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  };
};

const createVerificationToken = () => crypto.randomBytes(32).toString("hex");
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const deliverVerificationEmail = async (user) => {
  const token = createVerificationToken();
  user.emailVerificationTokenHash = hashToken(token);
  user.emailVerificationExpires = new Date(Date.now() + 30 * 60 * 1000);
  user.verificationEmailSentAt = new Date();
  await user.save();
  await sendVerificationEmail({ name: user.name, email: user.email, token });
};

// Public registration always creates an unverified standard user.
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must contain at least 8 characters." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });
    if (user?.isEmailVerified) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "user",
        isEmailVerified: false,
      });
    } else {
      // Allow an unverified account to request a fresh verification email.
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(409).json({ success: false, message: "An unverified account already exists for this email. Use the resend verification option." });
      }
    }

    try {
      await deliverVerificationEmail(user);
    } catch (mailError) {
      console.error("Verification email delivery error:", mailError.message);
      return res.status(503).json({
        success: false,
        accountCreated: true,
        message: "Your account is saved, but the verification email could not be sent. Check the email service configuration and use Resend verification.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Verification email sent. Open your inbox and verify your email before logging in.",
      email: user.email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token || typeof token !== "string") {
      return res.status(400).json({ success: false, message: "Verification token is missing or invalid." });
    }

    const user = await User.findOne({
      emailVerificationTokenHash: hashToken(token),
      emailVerificationExpires: { $gt: new Date() },
    }).select("+emailVerificationTokenHash +emailVerificationExpires");

    if (!user) {
      return res.status(400).json({ success: false, message: "This verification link is invalid or has expired. Request a new one." });
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpires = null;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ success: false, message: "Unable to verify email right now." });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: "Email address is required." });

    const user = await User.findOne({ email })
      .select("+verificationEmailSentAt +emailVerificationTokenHash +emailVerificationExpires");
    // Use the same generic response for unknown and already-verified accounts.
    const genericMessage = "If this account needs verification, a fresh email will be sent.";
    if (!user || user.isEmailVerified) {
      return res.status(200).json({ success: true, message: genericMessage });
    }

    if (user.verificationEmailSentAt && Date.now() - user.verificationEmailSentAt.getTime() < 60 * 1000) {
      return res.status(429).json({ success: false, message: "Please wait one minute before requesting another verification email." });
    }

    try {
      await deliverVerificationEmail(user);
    } catch (mailError) {
      console.error("Resend verification email error:", mailError.message);
      return res.status(503).json({ success: false, message: "Email could not be sent. Please try again later." });
    }

    return res.status(200).json({ success: true, message: genericMessage });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({ success: false, message: "Unable to resend verification email." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({ success: false, code: "EMAIL_NOT_VERIFIED", message: "Please verify your email before logging in." });
    }
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing in environment variables");

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      isAdmin: Boolean(process.env.ADMIN_EMAIL && user.email.toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase()),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return res.status(200).json({ success: true, message: "Logout successful." });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const isAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (!user.isEmailVerified) {
      return res.status(403).json({ success: false, code: "EMAIL_NOT_VERIFIED", message: "Please verify your email before continuing." });
    }
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    return res.status(200).json({
      success: true,
      message: "User is authenticated.",
      user,
      isAdmin: Boolean(adminEmail && user.email.toLowerCase() === adminEmail),
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
