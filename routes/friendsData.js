const express = require("express");
const router = express.Router();

const {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendsData,
} = require("../controllers/friendsData");

router.route("/").get(getFriendsData);
router.route("/send").post(sendFriendRequest);
router.route("/accept").post(acceptFriendRequest);

module.exports = router;
