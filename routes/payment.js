import express from "express";
import { registerAsIntructor } from "../controllers/payment";
import Auth from "../middleware/auth";

const router = express.Router();

router.post("/instructor", Auth, registerAsIntructor);

module.exports = router;
