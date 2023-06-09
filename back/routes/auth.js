/*const express = require('express');
const User = require('../model/user');
const router = express.Router()
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
      res.status(200).send('A token has been sent to your email for verification');
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
      secret: secret.base32
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

router.post('/verify', async (req, res) => {
    const { token, email } = req.body;
    const user = await User.findOne({ email });
    const { username } = user;
    const { session } = req;
    let tokenIsValid = speakeasy.totp.verify({
      secret: user.secret,
      encoding: "base32",
      token: token,
      window:2
    });
    if (tokenIsValid) {
      req.session.authenticated = true;
      req.session.userId = user._id;
      req.session.user = user;
      res.json({ msg: "logged in", user: username, status: true, creator: session.userId });
    } else {
      return res.json({ msg: "Incorrect Token", status: false });
    }
});
      
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
  })
  //console.log(user + "created")
  //let usernameTaken = await User.findOne({ username });
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

// write the edit webpage function here (change profile?)
