import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import path from "path";
dotenv.config();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
server.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
  connectDB();
});
