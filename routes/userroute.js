import express from "express";
import {
  DeleteUser,
  SignOut,
  updateUser
} from "../controllers/usercontroller.js";
import VerifyToken from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", VerifyToken, updateUser);
router.delete("/delete/:userId", VerifyToken, DeleteUser);
router.post("/signout", SignOut);

export default router;
