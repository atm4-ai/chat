
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("用户连接:", socket.id);

  socket.on("chat message", (data) => {
    io.emit("chat message", data); // 广播消息
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("服务器已启动: http://localhost:" + PORT);
});
