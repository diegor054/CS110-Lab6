const express = require("express");
const socket = require('socket.io');
const http = require('http');
const cors  = require("cors");
const session = require('express-session');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const rooms = require('./routes/rooms');

const app = express(); 
const server = http.createServer(app);

// added cors to allow cross origin requests
const io = socket(server, {
  cors: {
    origin: '*',
  }
});
app.use(cors({origin: `http://localhost:3000`, credentials:true }));

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to the database
mongoose.connect(process.env.MONGO_URL);
const database = mongoose.connection;

database.on('error', (error) => console.error(error));
database.once('open', () => console.log('Connected to Database'));

// Set up the session
const sessionMiddleware = session({
  resave: true, // Whether to save the session to the store on every request
  saveUninitialized: true, // Whether to save uninitialized sessions to the store
  secret: process.env.SESSION_SECRET,
})

app.use(sessionMiddleware);

app.get('/', (req, res) => {
  if (req.session && req.session.authenticated) {
    res.json({ message: "logged in" });
    console.log("logged in")
  }
  else {  
    console.log("not logged in")
    res.json({ message: "not logged" });
  }
});

app.use("/api/auth/", auth);

// checking the session before accessing the rooms
app.use((req, res, next) => {
  if (req.session && req.session.authenticated) {
    next();
  } else {
    res.status(401).send("Unauthorized");
    
  }
});
app.use("/api/rooms/", rooms);

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

// make sure that the user is logged in before connecting to the socket
io.use((socket, next) => {
  console.log("socket io middleware");
  sessionMiddleware(socket.request, {}, next);
});

//goes to else statement, need to fix/figure that out 
io.use((socket, next) => {
  if (socket.request.session && socket.request.session.authenticated) {
    next();
  } else {
    console.log("unauthorized");
    next(new Error("unauthorized"));
  }
});


io.on('connection', (socket)=>{
  console.log("user connected")
  // TODO: write codes for the messaging functionality
  // TODO: your code here
  // different types of callbacks in here
  // user sends a chat message, want to get that callback here and perform some operations
  // like user might send join and join them to a different room
  // we have written codes like this in week 8 with multiple rooms
  // first time user goes to a room, need to load a bunch of messages, history of that room and show it to the user (THIS IS NEW because we have DB)
  let room = undefined;
  let userName = undefined;
  console.log("user Connected")
  socket.on("disconnect", ()=>{
    console.log("user Disconnected")
  })
  socket.on("chat message", (data)=>{
    console.log("got the message", data)
    io.to(room).emit("chat message", data)
  })
  socket.on("join", (data) => {
    socket.join(data.room);
    room = data.room
    userName = data.username
    console.log(`user is joined to room ${data.room}`)
  })

  socket.emit("starting data", {"text":"hi"})
})