const { StatusCodes } = require("http-status-codes");
const FriendsData = require("../models/FriendsData");
const Account = require("../models/Account");
const Post = require("../models/Post");

const getFriendsData = async (req, res) => {
  const {
    user: { userId },
  } = req;
  const friendsData = await FriendsData.findOne({ createdBy: userId });

  const accountsIds = [
    ...friendsData.friendsList,
    ...friendsData.sentRequests,
    ...friendsData.receivedRequests,
  ];
  console.log(accountsIds);

  const accounts = await Account.find({ createdBy: { $ne: userId } });
  const potentialFriends = [];
  const accountsMap = {};
  accounts.forEach((account) => {
    accountsMap[account.createdBy] = account;
    //this should contain a list of people you may know according to matrix of similar interests and location.
    //this is out of scope for this project
    if (
      accountsIds.findIndex(
        (id) => id.toString() === account.createdBy.toString()
      ) === -1
    ) {
      potentialFriends.push(account.createdBy);
    }
  });
  res
    .status(StatusCodes.OK)
    .json({ friendsData, accountsIds, potentialFriends, accountsMap });
};

const sendFriendRequest = async (req, res) => {
  const {
    user: { userId },
    body: { requestedUserId },
  } = req;
  console.log(requestedUserId, userId);
  const friendsData = await FriendsData.findOne({ createdBy: userId });
  if (
    !friendsData.sentRequests.some((id) => id.toString() === requestedUserId)
  ) {
    friendsData.sentRequests.push(requestedUserId);
  }
  const receivingFriendRequest = await FriendsData.findOne({
    createdBy: requestedUserId,
  });
  if (
    !receivingFriendRequest.receivedRequests.some(
      (id) => id.toString() === userId
    )
  ) {
    receivingFriendRequest.receivedRequests.push(userId);
  }
  await friendsData.save();
  await receivingFriendRequest.save();
  res.status(StatusCodes.OK).json({ friendsData, receivingFriendRequest });
};

const acceptFriendRequest = async (req, res) => {
  const {
    user: { userId },
    body: { acceptedUserId },
  } = req;
  console.log(acceptedUserId, userId);

  const friendsData = await FriendsData.findOne({ createdBy: userId });
  const otherFriendRequest = await FriendsData.findOne({
    createdBy: acceptedUserId,
  });
  console.log(friendsData, otherFriendRequest);

  const requestIndex = friendsData.receivedRequests.findIndex(
    (id) => id.toString() === acceptedUserId
  );
  const otherRequestIndex = otherFriendRequest.sentRequests.findIndex(
    (id) => id.toString() === userId
  );
  if (requestIndex != -1 && otherRequestIndex != -1) {
    const [receivedRequestId] = friendsData.receivedRequests.splice(
      requestIndex,
      1
    );
    const [sentRequestId] = otherFriendRequest.sentRequests.splice(
      otherRequestIndex,
      1
    );
    console.log(receivedRequestId, sentRequestId);
    //putting in friendslist array
    friendsData.friendsList.push(receivedRequestId);
    otherFriendRequest.friendsList.push(sentRequestId);
  }
  await friendsData.save();
  await otherFriendRequest.save();
  res.status(StatusCodes.OK).json({ friendsData, otherFriendRequest });
};
module.exports = {
  getFriendsData,
  sendFriendRequest,
  acceptFriendRequest,
};
