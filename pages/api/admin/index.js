import cookie from "cookie";
import dbConnect from "../../../util/dbConnect";
import Admin from "../../../models/Admin";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  const { method } = req;
  console.log("Admin login attempt:", { method });
  
  try {
    await dbConnect();
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    return res.status(500).json({ message: "Database connection failed" });
  }

  if (method === "POST") {
    const { username, password } = req.body;
    try {
      console.log("Searching for admin with username:", username);
      let admin = await Admin.findOne({ username });
      console.log("Admin found in DB:", !!admin);

      // if not found, allow env fallback: if credentials match env, create admin record
      if (!admin) {
        console.log("Admin not found, checking env credentials");
        console.log("ENV USERNAME:", process.env.ADMIN_USERNAME);
        console.log("Provided username:", username);
        
        if (
          process.env.ADMIN_USERNAME &&
          process.env.ADMIN_PASSWORD &&
          username === process.env.ADMIN_USERNAME &&
          password === process.env.ADMIN_PASSWORD
        ) {
          console.log("Creating new admin from env credentials");
          admin = await Admin.create({ username, password });
          console.log("New admin created:", !!admin);
        }
      }

      if (!admin) {
        console.log("Admin authentication failed: no matching credentials");
        return res.status(400).json({ message: "Wrong Credentials" });
      }

      console.log("Comparing passwords");
      const isMatch = await bcrypt.compare(password, admin.password);
      console.log("Password match:", isMatch);

      if (!isMatch) {
        console.log("Password validation failed");
        return res.status(400).json({ message: "Wrong Credentials" });
      }

      console.log("Setting admin cookie");
      // set cookie token (use ADMIN_TOKEN env as shared secret)
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", process.env.ADMIN_TOKEN, {
          maxAge: 60 * 60,
          sameSite: "strict",
          path: "/",
        })
      );
      console.log("Admin login successful");
      return res.status(200).json({ message: "Success" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (method === "PUT") {
    // sign out / clear cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", process.env.ADMIN_TOKEN, {
        maxAge: -1,
        path: "/",
      })
    );
    res.status(200).json({ message: "Success" });
  }
};

export default handler;
