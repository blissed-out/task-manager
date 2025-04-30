import User from "../models/user.models.js";
import asyncHandler from "../utils/async_handler.js";
import {
    sendMail,
    emailVerificationContent,
    forgetPasswordMailContent,
} from "../utils/mail.js";

const home = async (req, res) => {
    res.send("this is home page sisters and brothers");
};

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    // get data from user
    // validate data
    // store in database (hash the password)
    // send response

    if (!username || !email || !password) {
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

    const createdUser = new User({ username, email, password });

    // const token = crypto.randomBytes(32).toString("hex");
    const { unhashedToken, tokenExpiry } = createdUser.generateTemporaryToken();

    // send token to user and set it to database
    createdUser.emailVerificationToken = unhashedToken;
    createdUser.emailVerificationExpiry = tokenExpiry;

    // save database
    createdUser.save();

    // send mail
    const verificationUrl = `${process.env.HOST}:${process.env.PORT}/api/v1/users/verify/${token}`;
    sendMail({
        mailgenContent: emailVerificationContent(username, verificationUrl),
        userEmail: email,
    });

    res.status(200).json({
        success: true,
        message: "User registered successfully",
    });
});

const verifyUser = asyncHandler(async (req, res) => {
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

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }

    // check expiry of the token
    if (user.emailVerificationExpiry <= Date.now()) {
        return res.status(401).json({
            success: false,
            message: "Token Expired",
        });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.save();

    return res.status(200).json({
        success: true,
        message: "user verified successfully",
    });
});

const loginUser = asyncHandler(async (req, res) => {
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

    if (!(await user.isPasswordCorrect(password))) {
        return res.status(401).json({
            success: false,
            message: "Password do not match",
        });
    }

    const token = user.generateAccessToken();

    const cookieOptions = {
        httpOnly: true,
        maxAge: 1 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        success: true,
        message: "Login successful",
    });
});

const forgetPassword = asyncHandler(async (req, res) => {
    // get email
    // validate email
    // store the resetPassword token in database, and send to user through mail
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not registered",
        });
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

    res.status(200).json({
        success: true,
        message: "forget password successful",
    });
});

const resetPassword = asyncHandler(async (req, res) => {
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

    const user = await User.findOne({ forgetPasswordToken: token });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }

    // check expiry time
    if (user.forgetPasswordExpiry <= Date.now()) {
        return res.status(401).json({
            success: false,
            message: "Token expired",
        });
    }

    // let user change password

    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return res.status(401).json({
            success: false,
            message: "All fields required",
        });
    }

    if (password != confirmPassword)
        return res
            .stauts(401)
            .json({ success: false, message: "Password do not match" });

    user.password = password;
    user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successful",
    });
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
