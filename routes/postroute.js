import express from "express";
import VerifyToken from "../utils/verifyUser.js";
import {
  CreatePost,
  DeletePost,
  GetPosts,
  UpdatePost
} from "../controllers/postcontroller.js";

const postRouter = express.Router();

postRouter.post("/create", VerifyToken, CreatePost);
postRouter.get("/getposts", GetPosts);
postRouter.delete("/deletepost/:postId/:userId", VerifyToken, DeletePost);
postRouter.put("/updatepost/:postId/:userId", VerifyToken, UpdatePost);

export default postRouter;
