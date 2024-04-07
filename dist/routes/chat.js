"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const chat_1 = require("../controllers/chat");
router.route("/chatMessages").get(chat_1.getChatMessagesByPage);
router.route("/lastMessages").get(chat_1.getLastChatMessages);
exports.default = router;
