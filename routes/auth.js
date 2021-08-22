import express from "express";
import { register, login } from "../controllers/auth";

const router = express.Router();

router.post("/register", register).post("/login", login);

module.exports = router;
