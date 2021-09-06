import User from "../models/user";
import asyncHandler from "express-async-handler";

export const user = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.json(user);
});
