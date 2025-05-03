import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const userSchema = new Schema(
    {
        id: {
            type: Number,
            required: false,
        },

        avatar: {
            type: {
                url: String,
                localpath: String,
            },
            default: {
                url: `https://placeholder.co/600x400`,
                localpath: "",
            },
        },

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true, // because of this, we don't need index field
            trim: true,
            lowercase: true,
        },

        fullname: {
            type: String,
            required: false,
        },

        password: {
            type: String, //hash it
            required: [true, "password is required"],
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        refreshToken: {
            type: String,
        },

        forgetPasswordToken: {
            type: String,
        },

        forgetPasswordExpiry: {
            type: String,
        },

        emailVerificationToken: {
            type: String,
        },

        emailVerificationExpiry: {
            type: String,
        },
    },
    { timestamps: true },
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        // { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
        { expiresIn: "10h" }, // BUG: setting to only 1 or 2 minute
    );
};

userSchema.methods.generateTemporaryToken = function () {
    const unhashedToken = crypto.randomBytes(20).toString("hex");

    // const hashedToken = crypto
    //     .createHash("sha265")
    //     .update(unhashedToken)
    //     .digest("hex");

    const tokenExpiry = Date.now() + 20 * 60 * 1000; // current date + 20 mins -> 20mins token Expiry

    return { unhashedToken, tokenExpiry };
};

const User = mongoose.model("User", userSchema);

export default User;
