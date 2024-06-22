import express from "express";
import {
  DeleteUser,
  SignOut,
  updateUser,
  Getusers,
  GetUser
} from "../controllers/usercontroller.js";
import VerifyToken from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", VerifyToken, updateUser);
router.delete("/delete/:userId", VerifyToken, DeleteUser);
router.post("/signout", SignOut);
router.get("/getUsers", VerifyToken, Getusers);
router.get("/:userId", GetUser);

export default router;
