import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import { ErrorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//signup api
export const SignUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    next(ErrorHandler(400, "All Fields are Required"));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("Signup Successful");
  } catch (error) {
    next(error);
  }
};

//signin api
export const SignIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(ErrorHandler(400, "All Fields are Required"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      next(ErrorHandler(404, "User not Found"));
    }
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(ErrorHandler(400, "Invalid Password"));
    }
    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
