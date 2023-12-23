const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://launch.playcanvas.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});const server = http.createServer(app);
const io = socketIO(server);

// Array to store connected socket IDs
const connectedSockets = [];

// Set up a simple route (optional)
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Store the socket ID in the array
  connectedSockets.push(socket.id);

  // Broadcast the updated array to all connected clients
  io.emit('connectedUsers', connectedSockets);

  // Handle messages from the client
  socket.on('message', (data) => {
    console.log('Message from client:', data);

    // Broadcast the message to all connected clients
    io.emit('message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');

    // Remove the disconnected socket ID from the array
    connectedSockets.splice(connectedSockets.indexOf(socket.id), 1);

    // Broadcast the updated array to all connected clients
    io.emit('connectedUsers', connectedSockets);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
