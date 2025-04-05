
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = [];

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  let currentUser = null;

  socket.on("join", (user) => {
    currentUser = user;
    users.push({ ...user, id: socket.id });
    io.emit("userList", users);
  });

  socket.on("chatMessage", (msg) => {
    if (currentUser) {
      io.emit("chatMessage", { ...currentUser, text: msg });
    }
  });

  socket.on("disconnect", () => {
    users = users.filter(u => u.id !== socket.id);
    io.emit("userList", users);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
