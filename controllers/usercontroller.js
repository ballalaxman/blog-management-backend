import bcryptjs from "bcryptjs";
import { ErrorHandler } from "../utils/error.js";
import User from "../models/usermodel.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(ErrorHandler(403, "You are not allowed to update the user"));
  }
  if (req.body.password) {
    if (req.body.password < 6) {
      return next(ErrorHandler(400, "Password must be more than 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username < 7 || req.body.username > 20) {
      return next(
        ErrorHandler(
          400,
          "Username should be greaterthan 7 and lessthan 20 chars"
        )
      );
    }
    if (req.body.username.includes(" ")) {
      return next(ErrorHandler(400, "Username should not contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(ErrorHandler(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        ErrorHandler(400, "username only contains letters and numbers only")
      );
    }
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          emil: req.body.email,
          password: req.body.password,
          profilePic: req.body.profilePic
        }
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updateUser
    });
  } catch (error) {
    next(error);
  }
};

export const DeleteUser = async (req, res, next) => {
  try {
    if (!req.params.userId) {
      return next(ErrorHandler(400, "userId is required"));
    }
    if (req.user.id !== req.params.userId) {
      return next(ErrorHandler(403, "You are not allowed to delete the user"));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
