const mongoose = require("mongoose");
const userIdDefinition = { type: mongoose.Types.ObjectId, ref: "User" };
const FriendsDataSchema = new mongoose.Schema(
  {
    createdBy: {
      unique: true,
      required: [true, "Please provide user"],
      ...userIdDefinition,
    },
    sentRequests: [userIdDefinition],
    receivedRequests: [userIdDefinition],
    friendsList: [userIdDefinition],
    totalRequests: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FriendsData", FriendsDataSchema);
