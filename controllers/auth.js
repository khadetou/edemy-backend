import User from "../models/user";
import asyncHandler from "express-async-handler";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import sendEMail from "../utils/SendEmail";
import crypto from "crypto";
import cloudinary from "cloudinary";

//Setting up cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    res.status(400).json({ errors: [{ msg: "User already exists" }] });
  }

  user = new User({
    name,
    email,
    password,
  });

  //Encrypt Password
  const salt = await bcryptjs.genSalt(10);
  user.password = await bcryptjs.hash(password, salt);

  await user.save();

  //Return jsonwebtoken
  const payload = {
    user: {
      id: user.id,
    },
  };

  jsonwebtoken.sign(
    payload,
    process.env.JWTS,
    { expiresIn: "3d" },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //CHECK IF THE USER EXIST
  let user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
  }

  //CHECK IF THE PASSWORD EXIST
  const isMatch = await bcryptjs.compare(password, user.password);

  if (!isMatch) {
    res.status(400).json({ errors: [{ msg: "Invalid Crendentials" }] });
  }

  //Return jsonwebtoken
  const payload = {
    user: {
      id: user.id,
      name: user.name,
    },
  };

  jsonwebtoken.sign(
    payload,
    process.env.JWTS,
    { expiresIn: "3d" },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});

//@desc Forgot password
//@route put/api/password/forgot

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404).json({ msg: "User not found with this email" });
  }

  //Get resetToken
  //Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hash and set to reset password field
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Set token expire time
  user.resetPasswordExpired = Date.now() + 30 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  //Create a reset password url
  // const url = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
  const resetUrl = `http://localhost:3000/password/reset/${resetToken}`;

  try {
    await sendEMail({
      email: user.email,
      subject: "Bookit Password Reset",
      resetUrl,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).send(error.message);
  }
});

//@desc reset password token
//@route put/api/password/reset/:token
export const resetPassword = asyncHandler(async (req, res, next) => {
  //Hash and set to reset password field
  let { password } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.id)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpired: { $gt: Date.now() },
  });

  console.log(user);

  if (!user) {
    res.status(400).json({
      message: "Password reset token is invalid or has been expired",
    });
  }

  //Set up the new password
  const salt = await bcryptjs.genSalt(10);
  password = await bcryptjs.hash(password, salt);

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpired = undefined;

  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
