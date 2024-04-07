"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const ChatMessage_1 = __importDefault(require("../models/ChatMessage"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function initializeSocket(server) {
    const io = new socket_io_1.Server(server, {});
    io.use((socket, next) => {
        if (socket.handshake.auth.token) {
            const { user } = jsonwebtoken_1.default.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
            console.log(user);
            socket.data.userId = user._id?.toString() || "";
        }
        next();
    });
    io.on("connection", async (socket) => {
        console.log("User connected");
        socket.on("join", async (userId, otherUserId) => {
            socket.data.room =
                userId.localeCompare(otherUserId) <= 0
                    ? `${userId}|${otherUserId}`
                    : `${otherUserId}|${userId}`;
            socket.join(socket.data.room);
            console.log(`joined the chat`);
            const previousMessages = await ChatMessage_1.default.find({
                room: socket.data.room,
            })
                .sort({ createdAt: -1 })
                .limit(10);
            const reversedMessages = previousMessages.reverse();
            socket.emit("previousMessages", reversedMessages);
        });
        // socket.on("nextMessages", async (index) => {
        //   const nextMessages = await ChatMessage.find({ room: socket.data.room })
        //     .sort({ createdAt: -1 })
        //     .skip(offset)
        //     .limit(pageSize);
        //
        //   const reversedNextMessages = nextMessages.reverse();
        //   socket.emit("nextSentMessages", reversedNextMessages);
        // });
        socket.on("message", async (messageContent) => {
            console.log(messageContent);
            if (!messageContent) {
                return;
            }
            const chatMessage = await ChatMessage_1.default.create({
                createdBy: socket.data.userId,
                message: messageContent,
                room: socket.data.room,
            });
            io.to(socket.data.room).emit("message", chatMessage);
        });
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
}
exports.initializeSocket = initializeSocket;
