const express = require("express");
const router = express.Router();

const {
  getAllPosts,
  getFriendsPosts,
  getPost,
  getUserPosts,
  getLikes,
  createPost,
  deletePost,
  likePost,
  unlikePost,
} = require("../controllers/posts");

router.route("/").get(getAllPosts).post(createPost);
router.route('/users/:id').get(getUserPosts)
router.route("/friends").get(getFriendsPosts);
router.route("/:id").get(getPost).delete(deletePost);
router.route("/likes/:id").get(getLikes);
router.route("/likes/like").post(likePost);
router.route("/likes/unlike").post(unlikePost);

module.exports = router;
