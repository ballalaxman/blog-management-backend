import express from "express";
import { test, updateUser } from "../controllers/usercontroller.js";
import VerifyToken from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", VerifyToken, updateUser);

export default router;
