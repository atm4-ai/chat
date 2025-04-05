const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const users = new Map();

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (user) => {
    users.set(socket.id, user);
    io.emit('userList', Array.from(users.values()));
  });

  socket.on('chatMessage', (msg) => {
    const user = users.get(socket.id);
    if (user) {
      io.emit('chatMessage', {
        name: user.name,
        avatar: user.avatar,
        text: msg,
        time: new Date().toLocaleTimeString()
      });
    }
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('userList', Array.from(users.values()));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});