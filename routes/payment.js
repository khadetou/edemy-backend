import express from "express";
import {
  registerAsIntructor,
  stripeStatus,
  getCurrentInstructor,
} from "../controllers/payment";
import Auth from "../middleware/auth";

const router = express.Router();

router
  .post("/instructor", Auth, registerAsIntructor)
  .post("/get-status", Auth, stripeStatus)
  .get("/current-instructor", Auth, getCurrentInstructor);

module.exports = router;
