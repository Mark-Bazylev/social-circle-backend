"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: [true, "Please provide user"],
        ref: "User",
    },
    content: {
        type: String,
        required: [true, "Please add text"],
        maxlength: 300,
    },
    likes: {
        type: [mongoose_1.default.Types.ObjectId],
        default: [],
    },
    commentsLength: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Post", PostSchema);
