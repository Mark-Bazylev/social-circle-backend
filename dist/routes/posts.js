"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const posts_1 = require("../controllers/posts");
router.route("/").get(posts_1.getAllPosts).post(posts_1.createPost);
router.route('/users/:id').get(posts_1.getUserPosts);
router.route("/friends").get(posts_1.getFriendsPosts);
router.route("/:id").get(posts_1.getPost).delete(posts_1.deletePost);
router.route("/likes/:id").get(posts_1.getLikes);
router.route("/likes/like").post(posts_1.likePost);
router.route("/likes/unlike").post(posts_1.unlikePost);
exports.default = router;
