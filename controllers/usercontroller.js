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
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
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

export const SignOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "User signed out successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const Getusers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(ErrorHandler(403, "You are not allowed to get users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers
    });
  } catch (error) {
    next(error);
  }
};
