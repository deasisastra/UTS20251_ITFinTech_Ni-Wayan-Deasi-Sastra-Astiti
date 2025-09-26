// src/pages/api/webhook/xendit.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import Checkout from "../../../models/checkout";
import Payment from "../../../models/payment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const event = req.body; // payload dari Xendit
    console.log("Xendit Webhook Event:", event);

    const { id, external_id, status, paid_at, payment_method } = event;

    // Cari payment berdasarkan invoiceId (id dari Xendit)
    const payment = await Payment.findOne({ xenditInvoiceId: id });

    if (!payment) {
      return res.status(404).json({ success: false, error: "Payment not found" });
    }

    // Update payment
    payment.status = status.toUpperCase(); // contoh: "PAID"
    payment.paymentMethod = payment_method || payment.paymentMethod;
    if (status === "PAID") {
      payment.paidAt = paid_at ? new Date(paid_at) : new Date();
    }
    await payment.save();

    // Update checkout status juga
    if (status === "PAID") {
      await Checkout.findByIdAndUpdate(payment.checkoutId, { status: "PAID" });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
