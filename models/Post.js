const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please add text"],
      maxlength: 300,
    },
    likes: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide user"],
      ref: "User",
    },
    commentsLength: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
