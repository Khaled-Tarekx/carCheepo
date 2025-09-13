/** @format */

import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";

import connectWithRetry from "./src/database/connection";
import Redis from "redis";
import bootstrap from "./src/setup/bootstrap";
import { initializeSocket } from "./src/modules/notifications/socket";

connectWithRetry();

export const client = Redis.createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

const port = process.env.PORT || 7500;

client.on("error", (err) => console.log("Redis Client Error", err));
client.connect().catch(console.error);

export const createApp = () => {
  const app = express();
  const server = http.createServer(app);

  // Add CORS configuration
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Authorization"],
    })
  );

  app.use(express.json({ limit: "10mb" }));

  // Initialize Socket.IO
  const io = initializeSocket(server);

  server.listen(port, () => {
    console.log(`App is listening on port ${port}`);
    console.log("Swagger UI is available on http://localhost:7500/api-docs");
  });

  bootstrap(app);

  return app;
};

createApp();
