"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatMessagesByPage = exports.getLastChatMessages = void 0;
const ChatMessage_1 = __importDefault(require("../models/ChatMessage"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const FriendsData_1 = __importDefault(require("../models/FriendsData"));
async function getLastChatMessages(req, res, next) {
    try {
        const { user } = req;
        const friendsData = await FriendsData_1.default.findOne({ createdBy: user?._id });
        const chatMessages = await ChatMessage_1.default.find({
            createdBy: { $in: friendsData?.friendsList },
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ userId: user?._id, chatMessages });
    }
    catch (e) {
        next(e);
    }
}
exports.getLastChatMessages = getLastChatMessages;
async function getChatMessagesByPage(req, res, next) {
    try {
        const { query: { pageIndex, userId, otherUserId }, } = req;
        if (!pageIndex || !userId || !otherUserId)
            throw new errors_1.BadRequestError("missing query params");
        const pageSize = 10;
        const offset = (pageIndex - 1) * pageSize;
        const roomId = userId.toString().localeCompare(otherUserId.toString()) <= 0
            ? `${userId}|${otherUserId}`
            : `${otherUserId}|${userId}`;
        const chatMessages = await ChatMessage_1.default.find({ room: roomId })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(pageSize);
        if (!chatMessages) {
            throw new errors_1.BadRequestError("couldn't find chat messages");
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(chatMessages);
    }
    catch (e) {
        next(e);
    }
}
exports.getChatMessagesByPage = getChatMessagesByPage;
