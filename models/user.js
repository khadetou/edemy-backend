import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    picture: {
      type: String,
      default: "/avatar.png",
    },
    role: {
      type: [String],
      default: "Subscriber",
      enum: ["Subscriber", "Instructor", "Admin"],
    },
    stripe_account_id: "",
    stripe_seller: {},
    stripeSession: {},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
