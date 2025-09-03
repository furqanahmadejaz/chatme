const express = require('express');
;
const {User, Message} = require('../models/UserModel');


const router = express.Router();

// router.get('/', async (req, res) => {
//     // Fetch all messages from the database
//     try {
//         const messages = await Message.find({}).sort({ createdAt: -1 });

//         const sender = await Promise.all(messages.map(async (message) => {
//             const user = await User.findById(message.senderid);
//             return user;
//         }));
//         const formattedMessages = messages.map((message, index) => ({
//             ...message.toObject(),
//             sender: sender[index],
//         }));

//         res.status(200).json(formattedMessages);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch messages' });
//     }
// });

router.get('/', async (req, res) => {
  try {
    const messages = await Message.find({})
      .sort({ createdAt: -1 })
      .populate('senderid', 'username email'); //  fetch only what you need

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});





module.exports = router;