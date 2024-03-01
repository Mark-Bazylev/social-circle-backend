const socketIo = require("socket.io");
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:9000",
      methods: ["GET", "POST"],
    },
  });
  io.use((socket, next) => {
    if (socket.handshake.auth.token) {
      const user = jwt.verify(
        socket.handshake.auth.token,
        process.env.JWT_SECRET
      );
      console.log(user);
      socket.userId = user.userId;
    }
    next();
  });
  io.on("connection", async (socket) => {
    console.log("User connected");

    socket.on("join", async (userId, otherUserId) => {
      socket.room =
        userId.localeCompare(otherUserId) <= 0
          ? `${userId}|${otherUserId}`
          : `${otherUserId}|${userId}`;

      socket.join(socket.room);
      console.log(`joined the chat`);
      const previousMessages = await ChatMessage.find({ room: socket.room })
        .sort({ createdAt: -1 })
        .limit(10);

      const reversedMessages = previousMessages.reverse();
      socket.emit("previousMessages", reversedMessages);
    });
    socket.on("nextMessages", async (index) => {

      const nextMessages = await ChatMessage.find({ room: socket.room })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(pageSize);

      const reversedNextMessages = nextMessages.reverse();
      socket.emit("nextSentMessages", reversedNextMessages);
    });
    socket.on("message", async (messageContent) => {
      console.log(messageContent);
      if (!messageContent) {
        return;
      }
      const chatMessage = await ChatMessage.create({
        createdBy: socket.userId,
        message: messageContent,
        room: socket.room,
      });

      io.to(socket.room).emit("message", chatMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initializeSocket;
