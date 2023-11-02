const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.static("./public"));
// Middleware to make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});
io.on("connection", (socket) => {
  console.log(`User connected`);
  socket.on("send-notification", (notification) => {
    io.emit("rcv-notification", notification);
  });
});
app.get("/sts", (req, res) => {
  io.emit("rcv-notification", req.query.message);
  res.send("Notification sent");
});
server.listen(3000, () => {
  console.log("listening on *:3000");
});
