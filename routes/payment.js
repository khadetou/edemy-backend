import express from "express";
import { registerAsIntructor, stripeStatus } from "../controllers/payment";
import Auth from "../middleware/auth";

const router = express.Router();

router
  .post("/instructor", Auth, registerAsIntructor)
  .post("/get-status", Auth, stripeStatus);

module.exports = router;
