"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AccountSchema = new mongoose_1.default.Schema({
    createdBy: {
        unique: true,
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"],
    },
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 50,
    },
    coverUrl: {
        type: String,
        required: [true, "Please provide cover Image"],
    },
    avatarUrl: {
        type: String,
        required: [true, "Please provide avatar Image"],
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Account", AccountSchema);
