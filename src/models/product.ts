import { Schema, model, models } from "mongoose";

export interface IProduct {
  _id?: string;
  name: string;
  category: "Food" | "Drinks" | "Snacks";
  price: number;
  image?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Food", "Drinks", "Snacks"],
    },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "📦" },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
