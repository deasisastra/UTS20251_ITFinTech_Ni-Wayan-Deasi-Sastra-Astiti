import Product from "../../../models/Product";
import dbConnect from "../../../util/dbConnect";

const handler = async (req, res) => {
  await dbConnect();
  const { method } = req;

  if (method === "GET") {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      console.log(err);
    }
  }

  if (method === "POST") {
    try {
      // Validate required fields
      if (!req.body.img) {
        return res.status(400).json({ error: "Image URL is required" });
      }
      
      const newProduct = await Product.create(req.body);
      res.status(201).json(newProduct);
    } catch (err) {
      console.error(err);
      // Send validation errors to client
      if (err.name === 'ValidationError') {
        return res.status(400).json({ 
          error: "Validation failed",
          details: Object.keys(err.errors).reduce((acc, key) => {
            acc[key] = err.errors[key].message;
            return acc;
          }, {})
        });
      }
      // Generic error
      res.status(500).json({ error: "Failed to create product" });
    }
  }
};

export default handler;
