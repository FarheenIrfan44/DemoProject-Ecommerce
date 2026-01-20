import userModel from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '2d'});
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email required." });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password requires." });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Password Incorrect." });
    }
    const token = createToken(user._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // checking user already exist or not
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill out name." });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill out email." });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill out password." });
    }
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User Already exist." });
    }

    //validations

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email." });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a strong password." });
    }

    let profilePicture;
    if (req.file?.path) {
      profilePicture = await uploadOnCloudinary(req.file.path);
    }
    //Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      profilePicture: profilePicture ? profilePicture.url : undefined,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.status(200).json({ success: true, token });
  } catch (error) {
   console.error("Signup Error:", error);
res.status(500).json({ success: false, message: error.message });
  }
};

export { loginUser, signupUser };
