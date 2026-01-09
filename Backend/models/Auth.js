import { Schema, model } from "mongoose";

const authSchema = new Schema(
    {
        name: { type: String },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        username: {
            type: String,
            sparse: true,
            unique: true,
            minlength: 4,
            maxlength: 30,
        },

        phone: {
            type: Number,
            sparse: true,
            unique: true,
        },

        password: {
            type: String,
            minlength: 8,
            maxlength: 60,
        },

        image: { type: String },

        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user", // ✅ THIS WAS MISSING
        },

        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },

        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },

        // 🔥 ADD FOR LOGIN OTP
        loginOtp: {
            type: String,
        },

        loginOtpExpiry: {
            type: Date,
        },


    },
    { timestamps: true }
);

const Auth = model("auth", authSchema, "auth");
export default Auth;
