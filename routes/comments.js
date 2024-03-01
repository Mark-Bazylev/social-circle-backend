const express = require("express");
const router = express.Router();

const {
  createComment,
  getMyComments,
  getPostComments,
  getComment,
  getCommentLikes,
  likeComment,
  unlikeComment,
} = require("../controllers/comments");

router.route("/").get(getMyComments).post(createComment);
router.route("/:id").get(getComment);
router.route("/post/:id").get(getPostComments);
router.route("/likes/:id").get(getCommentLikes);
router.route("/likes/like").post(likeComment);
router.route("/likes/unlike").post(unlikeComment);

module.exports = router;
