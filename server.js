const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

let onlineUsers = {};

io.on('connection', (socket) => {
  socket.on('user join', (userData) => {
    onlineUsers[socket.id] = userData;
    io.emit('user list', Object.values(onlineUsers));
  });

  socket.on('chat message', (msgData) => {
    io.emit('chat message', msgData);
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.id];
    io.emit('user list', Object.values(onlineUsers));
  });
});

http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});