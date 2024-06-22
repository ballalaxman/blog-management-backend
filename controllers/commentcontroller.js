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
