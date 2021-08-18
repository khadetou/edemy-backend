import asyncHandler from "express-async-handler";

export const register = asyncHandler(async (req, res) => {
  console.log(req.body);
  res.send("This is the authentication part");
});
