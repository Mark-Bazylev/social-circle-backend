"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userIdDefinition = { type: mongoose_1.default.Types.ObjectId, ref: "User" };
const FriendsDataSchema = new mongoose_1.default.Schema({
    createdBy: {
        unique: true,
        required: [true, "Please provide user"],
        ...userIdDefinition,
    },
    sentRequests: [userIdDefinition],
    receivedRequests: [userIdDefinition],
    friendsList: [userIdDefinition],
}, { timestamps: true });
exports.default = mongoose_1.default.model("FriendsData", FriendsDataSchema);
