import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      index: false, // explicitly disable indexing on fullName
    },
    email: {
      type: String,
      required: false, // Made optional since we're using phone
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    job: {
      type: String,
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Delete existing model if it exists to recreate with correct indexes
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model("User", UserSchema);
