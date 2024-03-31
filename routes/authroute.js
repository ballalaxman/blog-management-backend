import express from "express";
import { SignIn, SignUp, GoogleAuth } from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/signin", SignIn);
router.post("/google", GoogleAuth);

export default router;
