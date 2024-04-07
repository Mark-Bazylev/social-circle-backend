import { Server } from "socket.io";
import ChatMessage, { ChatMessageDocument } from "../models/ChatMessage";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../middleware/authentication";
import { Server as HttpServer, IncomingMessage, ServerResponse } from "http";
interface ServerToClientEvents {
  previousMessages: (messages: ChatMessageDocument[]) => void;
  message: (chatMessage: ChatMessageDocument) => void;
}

interface ClientToServerEvents {
  join: (userId: string, otherUserId: string) => Promise<void>;
  nextMessages: (index: number) => void;
  message: (messageContent: string) => Promise<void>;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  userId: string;
  room: string;
}

export function initializeSocket(
  server: HttpServer<typeof IncomingMessage, typeof ServerResponse>,
) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {

  });
  io.use((socket, next) => {
    if (socket.handshake.auth.token) {
      const { user } = jwt.verify(
        socket.handshake.auth.token,
        process.env.JWT_SECRET!,
      ) as JwtPayload;
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
      const previousMessages = await ChatMessage.find({
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
      const chatMessage = await ChatMessage.create({
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
