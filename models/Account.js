const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema(
  {
    createdBy: {
      unique: true,
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
    },
    coverUrl: {
      type: String,
      required: [true, "Please provide cover Image"],
    },
    avatarUrl: {
      type: String,
      required: [true, "Please provide avatar Image"],
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", AccountSchema);
