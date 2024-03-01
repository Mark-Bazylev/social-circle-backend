const express = require("express");
const router = express.Router();

const {
   getChatMessagesByPage,
    getLastChatMessages
} = require("../controllers/chat");

router.route("/chatMessages").get(getChatMessagesByPage)
router.route("/lastMessages").get(getLastChatMessages)
module.exports = router;
