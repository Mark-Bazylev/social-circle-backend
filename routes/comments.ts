import express from "express";
const router = express.Router();

import {
  createComment,
  getMyComments,
  getPostComments,
  getComment,
  getCommentLikes,
  likeComment,
  unlikeComment,
} from "../controllers/comments";

router.route("/").get(getMyComments).post(createComment);
router.route("/:id").get(getComment);
router.route("/post/:id").get(getPostComments);
router.route("/likes/:id").get(getCommentLikes);
router.route("/likes/like").post(likeComment);
router.route("/likes/unlike").post(unlikeComment);

export default router