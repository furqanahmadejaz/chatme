const express = require('express');
const {createServer} = require('node:http');
const {Server} = require('socket.io');
require('dotenv').config();
const cors = require('cors');




const app = express();
app.use(cors({ origin: '*', credentials: true }));
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
    socket.on('message', (msg) => {
        console.log('Message logged:', msg);
        // console.log('Message received:', msg.message, 'from user:', msg.username);
        io.emit('message', msg); // Broadcast the message to all connected clients
    });
});

app.get('/', (req, res) => {
  res.send('Welcome to the ChatMe server!');

});


const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});