import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// hash password before save if modified
AdminSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    console.log("Hashing admin password");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed successfully");
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
