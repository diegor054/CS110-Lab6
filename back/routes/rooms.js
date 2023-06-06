const express = require('express');
const router = express.Router()
// TODO: add rest of the necassary imports
const mongoose = require('mongoose');
const Room = require('../model/room');  // assuming you have a Room model
const User = require('../model/user');

module.exports = router;

//Get all the rooms
router.get('/all', async (req, res) => {
    // TODO: you have to check the database to only return the rooms that the user is in
    const userRooms = await Room.find({users: req.user._id});
    res.send(userRooms);
});


router.post('/create', async(req, res) => {
    // TODO: write necassary codesn to Create a new room
    const { roomName } = req.body;
    const newRoom = new Room({
        name: roomName,
        users: [req.user._id]
    });
    await newRoom.save();
    req.user.rooms.push(newRoom._id);
    await req.user.save();
    res.send(newRoom);
});

router.post('/join', async (req, res) => {
    // TODO: write necassary codes to join a new room
    const { roomName } = req.body;
    const roomToJoin = await Room.findOne({name: roomName});
    roomToJoin.users.push(req.user._id);
    await roomToJoin.save();
    req.user.rooms.push(roomToJoin._id);
    await req.user.save();
    res.send(roomToJoin);
});

router.delete('/leave', async (req, res) => {
    // TODO: write necassary codes to delete a room
    // owner of that room when they want to delete it they send in this type of request
    // want to delete room and remove room from array of rooms in each user rooms array
    const {roomId} = req.body;
    const roomToLeave = await Room.findById(roomId);
    const index = roomToLeave.users.indexOf(req.user._id);
    if (index > -1) {
        roomToLeave.users.splice(index, 1);
    }
    await roomToLeave.save();
    const roomIndex = req.user.rooms.indexOf(roomId);
    if (roomIndex > -1) {
        req.user.rooms.splice(roomIndex, 1);
    }
    await req.user.save();
    res.send(roomToLeave);
});