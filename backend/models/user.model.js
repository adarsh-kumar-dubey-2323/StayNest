import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, required: true, enum: ["user", "owner"], default: "user" },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationTokenHash: { type: String, default: null, select: false },
  emailVerificationExpires: { type: Date, default: null, select: false },
  verificationEmailSentAt: { type: Date, default: null, select: false },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
