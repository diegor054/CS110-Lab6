const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
    {
        name: {
        type: String,
        required: true,
        },
        code: {
            type: Number,
            required: true,
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }, 
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Room", roomSchema);