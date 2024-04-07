import express from "express";
const router = express.Router();

import {
  getChatMessagesByPage,
  getLastChatMessages,
} from "../controllers/chat";

router.route("/chatMessages").get(getChatMessagesByPage)
router.route("/lastMessages").get(getLastChatMessages)
export default router