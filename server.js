const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'client')));

let waiting = null;

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('join', () => {
    if (waiting && waiting.id !== socket.id) {
      const roomId = socket.id + '#' + waiting.id;
      socket.join(roomId);
      waiting.join(roomId);

      socket.emit('room', roomId);
      waiting.emit('room', roomId);

      console.log(`Paired: ${socket.id} & ${waiting.id}`);
      waiting = null;
    } else {
      waiting = socket;
      console.log(`${socket.id} is waiting`);
    }
  });

  socket.on('message', ({ roomId, message }) => {
    socket.to(roomId).emit('message', message);
  });

  socket.on('leave', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('leave');
    if (waiting && waiting.id === socket.id) {
      waiting = null;
    }
  });

  socket.on('disconnect', () => {
    if (waiting && waiting.id === socket.id) {
      waiting = null;
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
