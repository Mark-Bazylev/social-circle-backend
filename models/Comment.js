const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please add text"],
      maxlength: 300,
    },
    likes: { type: [mongoose.Types.ObjectId], default: [] },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide createdBy"],
    },
    commentedIn: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide origin Post"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
