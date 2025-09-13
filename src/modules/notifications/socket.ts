/** @format */

import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import Redis from "redis";

// Create Redis client for notifications
const client = Redis.createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

client.on("error", (err) => console.log("Redis Client Error", err));

// Connect Redis client if not already connected
if (!client.isOpen) {
  client.connect().catch(console.error);
}

export let io: SocketIOServer | null = null;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room based on user ID
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Function to send notification to a specific user
export const sendNotificationToUser = async (
  userId: string,
  event: string,
  data: any
) => {
  if (io) {
    // Emit to the specific user's room
    io.to(userId).emit(event, data);

    // Also save to Redis for offline notifications
    try {
      const notificationKey = `notifications:${userId}`;
      const notification = {
        id: Date.now().toString(),
        event,
        data,
        timestamp: new Date().toISOString(),
        read: false,
      };

      await client.lPush(notificationKey, JSON.stringify(notification));
      // Keep only last 100 notifications
      await client.lTrim(notificationKey, 0, 99);
    } catch (error) {
      console.error("Error saving notification to Redis:", error);
    }
  }
};

// Function to get unread notifications for a user
export const getUserNotifications = async (userId: string) => {
  try {
    const notificationKey = `notifications:${userId}`;
    const notifications = await client.lRange(notificationKey, 0, -1);
    return notifications.map((notification) => JSON.parse(notification));
  } catch (error) {
    console.error("Error retrieving notifications from Redis:", error);
    return [];
  }
};
