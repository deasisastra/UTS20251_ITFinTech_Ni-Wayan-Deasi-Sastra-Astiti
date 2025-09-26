import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb"; 
import Product from "../../models/product"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const products = await Product.find({});
      return res.status(200).json({ success: true, data: products });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Failed to fetch products" });
    }
  } 
  
  else if (req.method === "POST") {
    try {
      const { name, category, price, image, description } = req.body;

      if (!name || !category || !price) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      const product = await Product.create({
        name,
        category,
        price,
        image,
        description,
      });

      return res.status(201).json({ success: true, data: product });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Failed to create product" });
    }
  } 
  
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
