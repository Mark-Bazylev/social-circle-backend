"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: [true, "Please add text"],
        maxlength: 300,
    },
    likes: { type: [mongoose_1.default.Types.ObjectId], default: [] },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: [true, "Please provide createdBy"],
    },
    commentedIn: {
        type: mongoose_1.default.Types.ObjectId,
        required: [true, "Please provide origin Post"],
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Comment", CommentSchema);
