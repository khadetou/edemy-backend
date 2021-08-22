import User from "../models/user";
import asyncHandler from "express-async-handler";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

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
