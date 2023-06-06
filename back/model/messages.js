const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    message: {
      type: String, 
      required: true
    },
    sender: {
     // type: mongoose.Schema.Types.ObjectId,
      //ref: "User",
      //required: true,
      type: String,
      required: true
    },
    room: {
      //type: mongoose.Schema.Types.ObjectId,
      //ref: "Room",
      //required: true,
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", messageSchema);