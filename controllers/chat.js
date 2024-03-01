const ChatMessages = require("../models/ChatMessage");
const FriendsData = require("../models/FriendsData");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const getLastChatMessages = async (req, res) => {
  const { user: {userId} } = req;
  const friendsData = await FriendsData.findOne({ createdBy: userId });
  const chatMessages = await ChatMessages.find({
    createdBy: { $in: friendsData.friendsList },
  })
  res.status(StatusCodes.OK).json({userId,chatMessages})
};
const getChatMessagesByPage = async (req, res) => {
  const {
    query: { pageIndex, userId, otherUserId },
  } = req;
  if (!pageIndex || !userId || !otherUserId)
    throw new BadRequestError("missing query params");
  const pageSize = 10;
  const offset = (pageIndex - 1) * pageSize;
  const roomId =
    userId.localeCompare(otherUserId) <= 0
      ? `${userId}|${otherUserId}`
      : `${otherUserId}|${userId}`;
  const chatMessages = await ChatMessages.find({ room: roomId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(pageSize);
  if(!chatMessages){
    throw new BadRequestError("couldn't find chat messages")
  }
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',chatMessages,'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
  res.status(StatusCodes.OK).json(chatMessages);
};

module.exports = {
  getChatMessagesByPage,
  getLastChatMessages,
};
