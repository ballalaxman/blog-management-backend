import express from "express";
import { updateUser } from "../controllers/usercontroller.js";
import VerifyToken from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", VerifyToken, updateUser);
router.delete("/delete/:userId", VerifyToken);

export default router;
