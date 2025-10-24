import dbConnect from "../../../util/dbConnect";
import Otp from "../../../models/Otp";
import User from "../../../models/User";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  await dbConnect();
  if (req.method !== "POST") return res.status(405).end();
  try {
    // Accept explicit phoneNumber (registration flow) or use the logged-in user's phone
    let { phoneNumber } = req.body || {};

    if (!phoneNumber) {
      // try to get user's phone from session
      const session = await getSession({ req });
      if (!session?.user?.phone) {
        return res.status(400).json({ message: "Phone is required or user must be authenticated" });
      }
      phoneNumber = session.user.phone;
    }

    // make sure the phone belongs to a registered user when using session
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      // Allow sending to new phone numbers for registration flows (when phoneNumber was provided explicitly)
      if (!req.body?.phoneNumber) {
        return res.status(404).json({ message: "Registered user with this phone not found" });
      }
    }

    // generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create({ phoneNumber, code });

    // send via Twilio WhatsApp if configured
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
      const twilio = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await twilio.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
        to: `whatsapp:${phoneNumber}`,
        body: `Your verification code is: ${code}`,
      });
    } else {
      console.log(`OTP for ${phoneNumber}: ${code}`);
    }

    res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export default handler;
