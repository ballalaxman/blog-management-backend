import express from "express";
import VerifyToken from "../utils/verifyUser.js";
import { CreatePost } from "../controllers/postcontroller.js";

const postRouter = express.Router();

postRouter.post("/create", VerifyToken, CreatePost);

export default postRouter;
