const express = require('express');
const {createServer} = require('node:http');
const {Server} = require('socket.io');
require('dotenv').config();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const requireAuth = require('./middleware/requireAuth');
const mongoose = require('mongoose');
const messageRoutes = require('./routes/messageRoutes');

const UserModel = require('./models/UserModel');

const {User, Chat, Message} = UserModel;

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));
const server = createServer(app);

app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});
  


//   socket.on('message', (msg) => {
//       console.log('Message logged:', msg);

//       // Here you can save the message to the database if needed
//       Message.create({
//           senderid: msg.senderid,
//           chatid: null, // Assuming you have a chat ID to associate with the message
//           content: msg.content
//       }).then(() => {
//           console.log('Message saved to database');
//       }).catch((error) => {
//           console.error('Error saving message:', error);
//       });
      
//       io.emit('message', msg); 
//   });

// });
io.on("connection", (socket) => {
  console.log('A user connected');
  // Handle user joining a chat

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
  socket.on("message", async (msg) => {
    
    try {
      // Save the new message
      const newMessage = await Message.create(msg);

      //  Fetch it back, with sender info populated
      const populatedMessage = await newMessage.populate("senderid", "username email");
      console.log('Message logged:', populatedMessage);
      // Send to everyone
      io.emit("message", populatedMessage);
    } catch (err) {
      console.error(err);
    }
  });
});




mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
      server.listen(process.env.PORT, () => {
        console.log(
          `Connected to database and listening to port ${process.env.PORT}`
        );
      });
    }).catch((error) =>{
      console.log(error)
    });