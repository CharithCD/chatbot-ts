import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        require: [true, "Password is required"],
    },
    refreshToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    hasAccess:{
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    forgetPasswordToken: String,
    forgetPasswordExpire: Date,
    verifyToken: String,
    verifyExpire: Date,
}, { timestamps: true });


export const User = mongoose.models.User || mongoose.model("User", userSchema);