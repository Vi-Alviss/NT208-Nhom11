import { Server } from "socket.io";
import database from "./src/config/database.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL;
const SECRET_KEY = process.env.SECRET_KEY;

const setupSocket = (server) => {
  // tạo socket server
  const io = new Server(server, {
    cors: {
      origin: true, // Cho phép mọi origin
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // lấy userId từ token
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      socket.userId = decoded.userid;
      next();
    } catch (err) {
      console.error("JWT verify failed:", err);
      return next(new Error("Invalid token"));
    }
  });

  // kết nối với client
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Lắng nghe sự kiện gửi tin nhắn
    socket.on("sendMessage", async ({ conversationID, content, messageID }) => {
      const senderid = socket.userId;
      console.log("Data from client:", {
        conversationID,
        senderid,
        content,
        messageID,
      });

      // Broadcast tin nhắn cho người nhận
      socket.to(conversationID).emit("receiveMessage", {
        id: messageID,
        conversationID,
        senderid,
        content,
        createdAt: new Date().toISOString(),
      });
    });

    // Tham gia vào cuộc hội thoại
    socket.on("joinConversation", (conversationID) => {
      socket.join(conversationID);
      console.log(`User ${socket.id} joined conversation ${conversationID}`);
    });

    // Ngắt kết nối
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};

export default setupSocket;
