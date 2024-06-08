import express from "express";
import VerifyToken from "../utils/verifyUser.js";
import { CreatePost, GetPosts } from "../controllers/postcontroller.js";

const postRouter = express.Router();

postRouter.post("/create", VerifyToken, CreatePost);
postRouter.get("/getposts", GetPosts);

export default postRouter;
