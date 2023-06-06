const express = require('express');
const Messages = require('../model/messages');
const router = express.Router()

module.exports = router;

router.post('/',  async (req, res)=>{
    const {username, room, message} = req.body;
    const newMessage = new Messages ({
        sender: username,
        room: room,
        message: message,
    })
    console.log(newMessage + "created")
    try{
        const dataSaved = await newMessage.save();
        res.status(200).json({dataSaved, status: 200});
    }
    catch (error){
        console.log(error);
        res.send("ERROR!");
    }
  })