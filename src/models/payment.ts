import mongoose, { Document, Schema } from "mongoose";


export interface IPayment extends Document {
  external_id: string;
  status: "PENDING" | "PAID" | "EXPIRED"; 
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    external_id: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "PAID", "EXPIRED"], required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);
