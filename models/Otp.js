import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // expires after 5 minutes
  },
  { timestamps: true }
);

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
