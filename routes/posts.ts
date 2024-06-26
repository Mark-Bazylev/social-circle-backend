import express from "express";
const router = express.Router();

import {
  getAllPosts,
  getFriendsPosts,
  getPost,
  getUserPosts,
  getLikes,
  createPost,
  deletePost,
  likePost,
  unlikePost,
} from "../controllers/posts";

router.route("/").get(getAllPosts).post(createPost);
router.route('/users/:id').get(getUserPosts)
router.route("/friends").get(getFriendsPosts);
router.route("/:id").get(getPost).delete(deletePost);
router.route("/likes/:id").get(getLikes);
router.route("/likes/like").post(likePost);
router.route("/likes/unlike").post(unlikePost);

export default router