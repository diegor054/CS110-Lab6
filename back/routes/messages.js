const express = require('express');
const Messages = require('../model/messages');
const User = require('../model/user');
const router = express.Router()

module.exports = router;

router.get('/:room', async (req, res) => {
    const room = req.params.room;
    try {
        const messages = await Messages.find({room});
        for (let m of messages) {
            const sender = await User.findById(m.sender)
            m.sender = sender;
            //let user = await User.findById(userId);
            //let roomIndex = user.rooms.indexOf(roomID);
        }
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving message history");
    }
});

router.post('/',  async (req, res)=>{
    const {user, room, message} = req.body;
    const sender = await User.findById(user);
    console.log("user", user)
    console.log("sender", sender)
    const newMessage = new Messages ({
        sender: sender,
        room: room,
        message: message,
    })
    console.log("trying to send new message", newMessage)
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