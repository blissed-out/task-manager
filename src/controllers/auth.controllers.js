import User from "../models/user.models.js";
import asyncHandler from "../utils/async_handler.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";

import {
    sendMail,
    emailVerificationContent,
    forgetPasswordMailContent,
} from "../utils/mail.js";

const home = async (req, res) => {
    res.send("this is home page sisters and brothers");
};

const registerUser = asyncHandler(async (req, res) => {
    console.log("reigsterUser controller runned ");
    const { username, email, password } = req.body;
    // get data from user
    // validate data
    // store in database (hash the password)
    // send response

    // if (!username || !email || !password) {
    //     return res.status(401).json(new ApiError(401, "All fields requried"));
    // }

    const user = await User.findOne({ email });

    if (user) {
        return res
            .status(401)
            .json(new ApiError(401, "User already registered"));
    }

    const createdUser = new User({ username, email, password });

    // const token = crypto.randomBytes(32).toString("hex");
    const { unhashedToken, tokenExpiry } = createdUser.generateTemporaryToken();

    // send token to user and set it to database
    createdUser.emailVerificationToken = unhashedToken;
    createdUser.emailVerificationExpiry = tokenExpiry;

    // save database
    createdUser.save();

    // send mail
    const verificationUrl = `${process.env.HOST}:${process.env.PORT}/api/v1/users/verify/${unhashedToken}`;
    sendMail({
        mailgenContent: emailVerificationContent(username, verificationUrl),
        userEmail: email,
    });

    const data = {
        username: username,
        email: email,
    };

    res.status(200).json(
        new ApiResponse(200, data, "User registered successfully"),
    );
});

const verifyUser = asyncHandler(async (req, res) => {
    // get token from params
    // compare the params token with databse token
    // if not match: return error response
    // set isVerified to true
    // remove verification token from database

    const { token } = req.params;

    // if (!token) {
    //     return res.status(401).json(new ApiError(401, "Token not found"));
    // }

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
        return res.status(401).json(new ApiError(401, "Invalid token"));
    }

    // check expiry of the token
    if (user.emailVerificationExpiry <= Date.now()) {
        user.emailVerificationExpiry = undefined;
        return res.status(401).json(new ApiError(401, "Token Expired"));
    }

    const data = {
        email: user.email,
        username: user.username,
    };

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, data, "User verified Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    // get data
    // validate data
    // use jsonwebtoken cookies
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(401)
            .json(new ApiError(401, "All fields are required"));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json(new ApiError(401, "User not registered"));
    }

    if (!(await user.isPasswordCorrect(password))) {
        return res.status(401).json(new ApiError(401, "Password not matched"));
    }

    const token = user.generateAccessToken();

    const cookieOptions = {
        httpOnly: true,
        maxAge: 1 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    res.status(200).json(
        new ApiResponse(200, { message: "Login successfull" }),
    );
});

const forgetPassword = asyncHandler(async (req, res) => {
    // get email
    // validate email
    // store the resetPassword token in database, and send to user through mail
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json(new ApiError(401, "User not registered"));
    }

    const { unhashedToken, tokenExpiry } = user.generateTemporaryToken();

    const forgetPasswordUrl = `${process.env.HOST}:${process.env.PORT}/api/v1/users/resetPassword/${unhashedToken}`;

    sendMail({
        mailgenContent: forgetPasswordMailContent(
            user.username,
            forgetPasswordUrl,
        ),
        userEmail: email,
    });

    user.forgetPasswordToken = unhashedToken;
    user.forgetPasswordExpiry = tokenExpiry;

    // save database
    user.save();

    res.status(200).json(
        new ApiResponse(200, email, "reset password link sent"),
    );
});

const resetPassword = asyncHandler(async (req, res) => {
    // get data
    // validate data
    // let user change password
    // set to database
    // send response

    const { token } = req.params;

    if (!token) {
        return res.status(401).json(new ApiError(401, "Toke not found"));
    }

    const user = await User.findOne({ forgetPasswordToken: token });

    if (!user) {
        return res.status(401).json(new ApiError(401, "Invalid token"));
    }

    // check expiry time
    if (user.forgetPasswordExpiry <= Date.now()) {
        user.forgetPasswordExpiry = undefined;
        return res.status(401).json(new ApiError(401, "Token Expired"));
    }

    // let user change password

    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return res
            .status(401)
            .json(new ApiError(401, "All fields are required"));
    }

    if (password != confirmPassword) {
        return res.status(401).json(new ApiError(401, "Password do not match"));
    }

    user.password = password;

    res.status(200).json(
        new ApiResponse(200, user.email, "Password reset successful"),
    );
    user.save();
});

const getUser = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "get profile successful",
    });
};

export {
    registerUser,
    verifyUser,
    loginUser,
    forgetPassword,
    resetPassword,
    getUser,
    home,
};
