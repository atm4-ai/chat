const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" }
});

const users = [];

io.on("connection", (socket) => {
  console.log("✅ 有人连接了: ", socket.id);

  socket.on("join", (user) => {
    const existing = users.find(u => u.id === socket.id);
    if (!existing) {
      users.push({ id: socket.id, ...user });
    }
    io.emit("userList", users);
  });

  socket.on("chatMessage", (msg) => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      io.emit("chatMessage", {
        name: user.name,
        avatar: user.avatar,
        text: msg
      });
    }
  });

  socket.on("disconnect", () => {
    const index = users.findIndex(u => u.id === socket.id);
    if (index !== -1) users.splice(index, 1);
    io.emit("userList", users);
    console.log("❌ 用户断开连接：", socket.id);
  });
});

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("🚀 服务已启动，监听端口：" + PORT);
});
