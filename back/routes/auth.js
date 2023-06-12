/*const express = require('express');
const User = require('../model/user');
const Room = require('../model/room');  // assuming you have a Room model
const router = express.Router()
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//authentication
router.get('/', (req, res) => {
  if (req.session && req.session.authenticated) {
    res.json({ message: "logged in" });
    console.log("logged in");
  } else {  
    console.log("not logged in");
    res.json({ message: "not logged in" });
  }
});
// Set up a route for the login page (with 2fa)

router.post('/login', async (req, res) => {
  const {session} = req;
  const { email, password } = req.body;

  // check if user in database
  const user = await User.findOne({ email });
  
  if (!user)
    return res.json({ msg: "Incorrect Email ", status: false });
  else if (user.password !== password)
    return res.json({ msg: "Incorrect Password", status: false });
  else {
    let token = speakeasy.totp({
      secret: user.secret,
      encoding: "base32",
    });
    const msg = {
        to: user.email,
        from: "dboul001@ucr.edu",
        subject: "CS110 Login Verification",
        html: `<h1>Your 2FA token is: ${token}</h1>`
      };
    sgMail.send(msg);
    session.user = user;
    console.log(user, "in log in this is the user");
    res.status(200).json({ msg: "logged in", tokenRequired: true, user: user });
  }
});

// Set up a route for the logout page
router.post('/logout', async (req, res) => {
    // Clear the session data and redirect to the home page
    req.session.destroy();
    res.send({msg: "logged out", status: true})
});

// write the sign up page here
router.post('/signup',  async (req, res)=>{
  const {email, password, name, username} = req.body;
  let secret = speakeasy.generateSecret({length: 20});
  const user = new User ({
      email: email,
      username: username,
      password: password,
      name: name,
      secret: secret.base32,
      pfp: null
  })
  if((await User.findOne({ email })) != null){
    res.send(JSON.stringify("Email already registered"));
  }else{
  try{
      const dataSaved = await user.save();
      res.status(200).json({dataSaved, status: 200});
    }
  catch (error){
      console.log(error);
      res.send("ERROR!");
    }
  }
})

//route to verify 2fa token:
router.post('/verify', async (req, res) => {
  const { token } = req.body;
  console.log("req.session.user:", req.session.user);
  console.log("Entered Token:", token);
  if (!req.session.user || !req.session.user.email) {
    return res.json({ msg: "User not found", status: false });
  }
  const { email } = req.session.user; 
  console.log("Email from session:", email); 
  const user = await User.findOne({ email });
  console.log("User from database:", user);
  if (!user) {
    return res.json({ msg: "User not found", status: false });
  }
  const { username } = user;
  const { session } = req;
  let tokenIsValid = speakeasy.totp.verify({
    secret: user.secret,
    encoding: "base32",
    token: token,
    window:2
  });
  console.log("Token validation result:", tokenIsValid); 
  if (tokenIsValid) {
    req.session.authenticated = true;
    req.session.userId = user._id;
    req.session.user = user;
    res.json({ msg: "logged in", user: user, status: true});
  } else {
    return res.json({ msg: "Incorrect Token", status: false });
  }
});

router.post('/editPFP', async (req, res) => {
  const { newProfilePic, username } = req.body;
  const user = await User.findOne({ username });
  user.pfp = newProfilePic;
  await user.save();
});

// write the edit webpage function here (change profile?)

module.exports = router;
*/
const express = require('express');
const User = require('../model/user');
const Room = require('../model/room');  // assuming you have a Room model
const router = express.Router()

module.exports = router;

router.post('/login', async (req, res) => {
    const {session} = req;
    const { username, password } = req.body;

    // check if user in database
    const user = await User.findOne({ username });
    
    if (!user)
      return res.json({ msg: "Incorrect Username ", status: false });
    else if (user.password !== password)
      return res.json({ msg: "Incorrect Password", status: false });
    else {
      session.authenticated = true;
      session.userId = user._id;
      req.user = user;
      const userRooms = await Room.find({users: user._id})
      user.rooms = userRooms;
      console.log("user logged in: ", user)
      res.json({ msg: "logged in",user:user});
    }
});

// Set up a route for the logout page
router.post('/logout', async (req, res) => {
    // Clear the session data and redirect to the home page
    req.session.destroy();
    res.send({msg: "logged out", status: true})
});

// write the sign up page here
router.post('/signup',  async (req, res)=>{
  const {username, password, name} = req.body;
  const user = new User ({
      username: username,
      password: password,
      name: name,
      pfp: null
  })
  if((await User.findOne({ username })) != null){
    res.send(JSON.stringify("Username not available"));
  }else{
  try{
      const dataSaved = await user.save();
      res.status(200).json({dataSaved, status: 200});
    }
  catch (error){
      console.log(error);
      res.send("ERROR!");
    }
  }
})


router.post('/editPFP', async (req, res) => {
  // TODO: write necassary codes to join a new room
  const { newProfilePic, username } = req.body;
  const user = await User.findOne({ username });
  user.pfp = newProfilePic;
  await user.save();
});

router.post('/editname', async (req, res) => {
  // TODO: write necassary codes to join a new room
  const { newName, username } = req.body;
  console.log("My name change is:", newName)
  const user = await User.findOne({ username });
  user.name = newName;
  await user.save();
});

// write the edit webpage function here (change profile?)