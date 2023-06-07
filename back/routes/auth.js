const express = require('express');
const User = require('../model/user');
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
      console.log("Session after login:", session);  // Log the session
      console.log("HEEEEEE" , session.userId)
      req.user = user;
      res.json({ msg: "logged in",user:username, status: true, creator:session.userId, });
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