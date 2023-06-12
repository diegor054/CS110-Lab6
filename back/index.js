const express = require("express");
const socket = require('socket.io');
const http = require('http');
const cors = require("cors");
const session = require('express-session');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const rooms = require('./routes/rooms');
const messages = require('./routes/messages');
const User = require('./model/user');

const app = express();
const server = http.createServer(app);

// added cors to allow cross origin requests
const io = socket(server, {
    cors: {
        origin: '*',
    }
});
app.use(cors({ origin: `http://localhost:3000`, credentials: true }));

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

app.use(async (req, res, next) => {
    if (req.session && req.session.authenticated) {
        req.user = await User.findById(req.session.userId);
        next();
    } else {
        next();
    }
});


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
app.use("/api/messages/", messages);

// Start the server
server.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});

// make sure that the user is logged in before connecting to the socket
io.use((socket, next) => {
    console.log("socket io middleware");
    sessionMiddleware(socket.request, {}, next);
});
 
io.use((socket, next) => {
    if (socket.request.session && socket.request.session.authenticated) {
        next();
    } else {
        console.log("unauthorized");
        next(new Error("unauthorized"));
    }
});

// handle socket connections for messaging functionality
io.on('connection', (socket) => {
    console.log("user connected")
    let room = undefined;
    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
    socket.on("chat message", (data) => {
        console.log("got the message", data)
        io.to(room).emit("chat message", data)
    })
    socket.on("edit message", (data) => {
        console.log("got the message", data)
        io.to(room).emit("edit message", data)
    })
    socket.on("join", (data) => {
        socket.join(data.room);
        room = data.room;
        console.log(`socket: user ${data.username} is joined to room ${data.room}`);
    })
    socket.emit("starting data", { "text": "hi" })
})