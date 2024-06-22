import express from "express";
import VerifyToken from "../utils/verifyUser.js";
import {
  CreateComment,
  GetComments,
  LikeComment
} from "../controllers/commentcontroller.js";

const commentRouter = express.Router();

commentRouter.post("/create", VerifyToken, CreateComment);
commentRouter.get("/getPostComments/:postId", GetComments);
commentRouter.put("/likeComment/:commentId", VerifyToken, LikeComment);

export default commentRouter;
