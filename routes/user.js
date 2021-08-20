import express from "express";
import { user } from "../controllers/user";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/user/profile", auth, user);

module.exports = router;
