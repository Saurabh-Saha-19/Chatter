import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectToMongoDB } from "./db.config.js";
import { activeUserModel } from "./activeUser.schema.js";
import { messageModel } from "./message.schema.js";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.addListener("connection", (socket) => {
  console.log("Connection is on");

  socket.on("add-activeUser", async (data) => {
    try {
      const newActiveUser = new activeUserModel({ username: data.username });
      await newActiveUser.save();
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("join", async (data) => {
    //append the user to the sidebar.
    console.log("Inside server.js");
    try {
      const activeUsers = await activeUserModel.find();
      socket.emit("new-user", activeUsers);

      const currUser = await activeUserModel.findOne({
        username: data.username,
      });

      if (activeUsers.length <= 1) {
        return;
      }
      socket.broadcast.emit("new-user", {
        name: data.username,
        id: currUser._id,
      });
      console.log("After emitter");
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("typing", async (data) => {
    const user = await activeUserModel.findOne({ username: data.username });
    console.log(user);
    socket.broadcast.emit("user-typing", user._id);
  });

  io.addListener("disconnect", () => {
    console.log("Connection is off");
  });

  socket.on("new-msg", async (user, message) => {
    try {
      const userFound = await activeUserModel.findOne({
        username: user.username,
      });

      if (!userFound) {
        throw new Error("user not found");
      }
      const newMessage = new messageModel({
        username: user.username,
        message: message,
        userId: userFound._id,
      });

      await newMessage.save();
      io.emit("add-new-msg", newMessage);
    } catch (err) {
      console.log(err.message);
    }
  });
});

server.listen("3000", () => {
  connectToMongoDB();
  console.log("Listening on port 3000");
});
