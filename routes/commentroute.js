import express from "express";
import VerifyToken from "../utils/verifyUser.js";
import {
  CreateComment,
  EditComment,
  GetComments,
  LikeComment,
  DeleteComment,
  GetAllComments
} from "../controllers/commentcontroller.js";

const commentRouter = express.Router();

commentRouter.post("/create", VerifyToken, CreateComment);
commentRouter.get("/getComments", VerifyToken, GetAllComments);
commentRouter.get("/getPostComments/:postId", GetComments);
commentRouter.put("/likeComment/:commentId", VerifyToken, LikeComment);
commentRouter.put("/editComment/:commentId", VerifyToken, EditComment);
commentRouter.delete("/delete/:commentId", VerifyToken, DeleteComment);

export default commentRouter;
