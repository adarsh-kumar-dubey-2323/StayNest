import mongoose from "mongoose";

const ownerApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  hotelName: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  hotelAddress: { type: String, required: true, trim: true, maxlength: 500 },
  message: { type: String, trim: true, maxlength: 1000, default: "" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
  reviewedAt: { type: Date, default: null },
}, { timestamps: true });

const OwnerApplication = mongoose.model("OwnerApplication", ownerApplicationSchema);
export default OwnerApplication;
