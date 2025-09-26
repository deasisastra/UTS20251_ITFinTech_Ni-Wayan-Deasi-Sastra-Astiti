import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import Payment from "../../../models/payment";

interface XenditEvent {
  id: string;
  external_id: string;
  status: "PENDING" | "PAID" | "EXPIRED";
  amount: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const event: XenditEvent = req.body; 
    console.log("Webhook received:", event);

   
    await Payment.findOneAndUpdate(
      { external_id: event.external_id },
      { status: event.status },
      { new: true, upsert: true } 
    );

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
