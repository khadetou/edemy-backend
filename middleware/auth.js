import jsonwebtoken from "jsonwebtoken";
import User from "../models/user.js";
import asyncHandler from "express-async-handler";

export default (req, res, next) => {
  //GET TOKEN FROM HEADER
  const token = req.header("x-auth-token");

  //CHECK IF NOT TOKEN
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //VERIFICATION TOKEN
  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWTS);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export const isAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  if (user && user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an Admin");
  }
});
