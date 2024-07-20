import Comment from "../models/commentmodel.js";

export const CreateComment = async (req, res, next) => {
  try {
    const { userId, postId, content } = req.body;
    if (userId !== req.user.id) {
      return next(
        ErrorHandler(403, "You are not allowed to comment on this post")
      );
    }
    const newComment = await Comment.create({
      userId,
      postId,
      content
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const GetComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const LikeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(ErrorHandler(404, "Comment not found"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.NumberofLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.NumberofLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const EditComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(ErrorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        ErrorHandler(403, "You are not allowed to edit this comment")
      );
    }
    const editetedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content
      },
      { new: true }
    );
    res.status(200).json(editetedComment);
  } catch (error) {
    next(error);
  }
};

export const DeleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(ErrorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        ErrorHandler(403, "You are not allowed to Delete this comment")
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    return res.status(200).json("Comment hass been deleted");
  } catch (error) {
    next(error);
  }
};

export const GetAllComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(ErrorHandler(403, "You are not allowed to get all comments"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments
    });
  } catch (error) {
    next(error);
  }
};
