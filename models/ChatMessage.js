const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Types.ObjectId,
            required: [true, "Please provide user"],
            ref: "User",
        },
        message: {
            type: String,
            required: [true, "Please add text"],
            maxlength: 300,
        },
        room:{
            type:String,
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
