import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const verifyJWT = async (req,res,next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
     return res.status(400).json({success: false, message: "No token provided."})
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decodedToken?.id).select(
      "-password"
    );
    if (!user) {
     return res.status(400).json({success: false, message: "Token invalid or expired."})
    }
    req.user = user;
    next();
  } catch (error) {
   return res.status(400).json({success: false, message: "Token is invalid."})
  }
};
