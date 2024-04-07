"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChatMessageSchema = new mongoose_1.default.Schema({
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: [true, "Please provide user"],
        ref: "User",
    },
    message: {
        type: String,
        required: [true, "Please add text"],
        maxlength: 300,
    },
    room: {
        type: String,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("ChatMessage", ChatMessageSchema);
