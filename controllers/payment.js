import User from "../models/user";
import asyncHandler from "express-async-handler";
import queryString from "query-string";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//I used connect here stripe connect
export const registerAsIntructor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).exec();
  if (!user) {
    res.status(404).json({ message: "User was not found" });
  }
  // 2. if user dont have stripe_account_id yet, then create new

  if (!user.stripe_account_id) {
    const account = await stripe.accounts.create({ type: "express" });

    // console.log('ACCOUNT => ', account.id)
    user.stripe_account_id = account.id;
    user.save();
  }

  // 3. create account link based on account id (for frontend to complete onboarding)
  let accountLink = await stripe.accountLinks.create({
    account: user.stripe_account_id,
    refresh_url: process.env.STRIPE_URL,
    return_url: process.env.STRIPE_URL,
    type: "account_onboarding",
  });

  // 4. pre-fill any info such as email (optional), then send url resposne to frontend
  // same as : accountLink = {...accountLink, "stripe_user[email]": user.email}
  accountLink = Object.assign(accountLink, {
    "stripe_user[email]": user.email,
  });
  // 5. then send the account link as response to fronend
  res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
});

export const stripeStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).exec();
  if (!user) {
    res.status(404).json({ message: "User was not found" });
  }

  const account = await stripe.accounts.retrieve(user.stripe_account_id);

  if (!account.charges_enabled) {
    return res.status(401).send("UnAuthorized");
  } else {
    const statusUpdated = await User.findByIdAndUpdate(
      user.id,
      {
        stripe_seller: account,
        $addToSet: { role: "Instructor" },
      },
      { new: true }
    )
      .select("-password")
      .exec();

    res.json(statusUpdated);
  }
});
