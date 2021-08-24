import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/auth";

const router = express.Router();

router.post("/register", register).post("/login", login);
router
  .post("/password/forgot", forgotPassword)
  .put("/password/reset/:id", resetPassword);
module.exports = router;
