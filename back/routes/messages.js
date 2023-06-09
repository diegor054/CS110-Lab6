const express = require('express');
const Messages = require('../model/messages');
const router = express.Router()

module.exports = router;

router.get('/:room', async (req, res) => {
    const room = req.params.room;
    try {
        const messages = await Messages.find({room});
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving message history");
    }
});

router.post('/',  async (req, res)=>{
    const {username, room, message} = req.body;
    const newMessage = new Messages ({
        sender: username,
        room: room,
        message: message,
    })
    try{
        const dataSaved = await newMessage.save();
        res.status(200).json({dataSaved, status: 200});
    }
    catch (error){
        console.log(error);
        res.send("ERROR!");
    }
})

router.get('/check/:room', async (req, res) => {
    const room = req.params.room;
    try {
      const lastMessageCount = req.query.lastMessageCount;
      const query = { room };
      const messageCount = await Messages.countDocuments(query);
  
      const newMessageCount = messageCount - lastMessageCount;
      const hasNewMessages = newMessageCount !== 0;
  
      res.status(200).json({ newMessages: hasNewMessages, messageCount });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error checking for new messages");
    }
  });