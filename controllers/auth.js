import asyncHandler from "express-async-handler";

export const register = asyncHandler(async (req, res) => {
  res.send("This is the authentication part");
});
