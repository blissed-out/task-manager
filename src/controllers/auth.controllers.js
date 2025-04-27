import User from "../models/user.model.js";
import crypto from "crypto";
import asyncHandler from "../utils/async_handler.js";

const home = async (req, res) => {
  res.send("this is home page sisters and brothers");
};

const register = asyncHandler(() => {
  async (req, res) => {
    const { name, email, password } = req.body;
    // get data from user
    // validate data
    // store in database (hash the password)
    // send response

    if (!name || !email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.name = name;
    user.email = email;
    user.password = password;

    // send token to user and set it to database
    user.verificationToken = token;

    // save database
    user.save();

    // send mail todo

    res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  };
});
const verifyUser = async (req, res) => {
  // get token from params
  // compare the params token with databse token
  // if not match: return error response
  // set isVerified to true
  // remove verification token from database

  const { token } = req.params;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Token not found",
    });
  }

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.save();
};

const login = async (req, res) => {
  // get data
  // validate data
  // use jsonwebtoken cookies
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not registered",
    });
  }

  if (user.password != password) {
    return res.status(401).json({
      success: false,
      message: "Wrong password",
    });
  }

  res.status(200).json({
    success: false,
    message: "Login successful",
  });
};

const forgetPassword = async (req, res) => {
  // get email
  // validate email
  // store the resetPassword token in database, and send to user through mail

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered",
      });
    }

    // token = resetPasswordToken
    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token; // set to database

    // save database
    user.save();
    sendMail(forgetPassword, token); // TODO: send token to user through nodemailer

    res.status(200).json({
      success: false,
      message: "forget password successfull",
    });
  } catch (error) {
    console.error("Error in forgetPassword controller", error);
  }
};

const resetPassword = async (req, res) => {
  // get data
  // validate data
  // let user change password
  // set to database
  // send response

  const { token } = req.params;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token not found",
    });
  }

  try {
    const user = await findOne({ resetPasswordToken: token });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // let user change password

    const { password, confirm_password } = req.body;

    if (password != confirm_password)
      return res
        .stauts(401)
        .json({ success: false, message: "Password do not match" });

    user.password = password;
    user.save();
  } catch (error) {
    console.error("Error in reset password controller: ", error);
  }
};

export { register, verifyUser, login, forgetPassword, resetPassword, home };
