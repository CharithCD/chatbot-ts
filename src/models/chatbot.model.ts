import mongoose, { Schema } from "mongoose";

const chatbotSchema = new Schema({
    business: {
        type: Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    openaiKey: {
        iv: {
            type: String,
            required: true
        },
        encryptedData: {
            type: String,
            required: true
        }
    },
    model: {
        type: String,
        default: "text-davinci-003"
    },
    account: {
        type: String
    }
}, { timestamps: true });

export const Chatbot = mongoose.models.Chatbot || mongoose.model("Chatbot", chatbotSchema);
