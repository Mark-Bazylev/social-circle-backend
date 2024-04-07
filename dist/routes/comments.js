"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comments_1 = require("../controllers/comments");
router.route("/").get(comments_1.getMyComments).post(comments_1.createComment);
router.route("/:id").get(comments_1.getComment);
router.route("/post/:id").get(comments_1.getPostComments);
router.route("/likes/:id").get(comments_1.getCommentLikes);
router.route("/likes/like").post(comments_1.likeComment);
router.route("/likes/unlike").post(comments_1.unlikeComment);
exports.default = router;
