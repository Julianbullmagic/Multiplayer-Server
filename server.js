const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var cors = require('cors')
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://launch.playcanvas.com",
    methods: ["GET", "POST"]
  }
});
app.use(cors())
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*")
  res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
  next();
})
// Array to store connected socket IDs
let connectedSockets = [];
let players=[]
// Set up a simple route (optional)
app.get('/', (req, res) => {
  res.send('Server is running');
});
setInterval(sendState, 40)

function sendState(){
  io.emit('state update broadcast', players);
}
// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Store the socket ID in the array
  connectedSockets.push(socket.id);
  socket.emit('your socket', socket.id);

  // Broadcast the updated array to all connected clients
  io.emit('connectedUsers', connectedSockets);

  // Handle messages from the client

  socket.on('update state', (data) => {
      playersockets=players.map(item=>item.socket)
      if(!playersockets.includes(data.socket)){
        players.push(data)
      }
    for(let player of players){
      if(player.socket){
        if(player.socket==data.socket){
          player=data
        }
      }  
      }
    console.log(players)
  });

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
