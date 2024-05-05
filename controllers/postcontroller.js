import Post from "../models/postmodel.js";
import { ErrorHandler } from "../utils/error.js";

export const CreatePost = async (req, res, next) => {
  if (!req.body.isAdmin) {
    return next(ErrorHandler(403, "You do not have permission to Create Post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(ErrorHandler(400, "All Fields are Required"));
  }
  const slug = req.body
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.body.userId
  });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
};
