import jwt from "jsonwebtoken";
import { ErrorHandler } from "./error.js";

const VerifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(ErrorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(ErrorHandler(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
};

export default VerifyToken;
