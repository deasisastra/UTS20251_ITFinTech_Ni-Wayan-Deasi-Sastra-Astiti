import dbConnect from "../../../util/dbConnect";
import Otp from "../../../models/Otp";
import User from "../../../models/User";

const handler = async (req, res) => {
  await dbConnect();
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code) return res.status(400).json({ message: "Phone and code required" });

    // Find and delete OTP in one operation
    const record = await Otp.findOneAndDelete({ phoneNumber, code });
    if (!record) return res.status(400).json({ message: "Invalid code" });

    // Mark as verified and return success immediately
    res.status(200).json({ message: "Phone verified" });
    
    // Update user in background if exists (don't wait for it)
    User.findOneAndUpdate(
      { phoneNumber },
      { phoneVerified: true },
      { new: true }
    ).catch(console.error);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export default handler;
