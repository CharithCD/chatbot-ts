import mongoose, { Schema } from "mongoose";

const businessSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    website: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    faq: [{ question: String, answer: String }],
}, { timestamps: true });

export const Business = mongoose.models.Business || mongoose.model("Business", businessSchema);