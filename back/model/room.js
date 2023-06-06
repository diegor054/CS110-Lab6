const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
    {
        name: {
        type: String,
        required: true,
        },
        username: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }, 
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Room", roomSchema);