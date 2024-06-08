import Post from "../models/postmodel.js";
import { ErrorHandler } from "../utils/error.js";

export const CreatePost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(ErrorHandler(403, "You do not have permission to Create Post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(ErrorHandler(400, "All Fields are Required"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id
  });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const GetPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const filter = {};

    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.slug) {
      filter.slug = req.query.slug;
    }

    if (req.query.postId) {
      filter._id = req.query.postId;
    }

    if (req.query.searchTerm) {
      filter.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } }
      ];
    }

    const posts = await Post.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPost = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const totalPostInLastMonth = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({
      posts,
      totalPost,
      totalPostInLastMonth
    });
  } catch (error) {
    next(error);
  }
};

export const DeletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(ErrorHandler(403, "You are not allowed to delete the post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The Post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const UpdatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(ErrorHandler(403, "You are not allowed to delete the post"));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image
        }
      },
      { new: true },
      { upsert: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
