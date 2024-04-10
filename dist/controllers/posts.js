"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikePost = exports.likePost = exports.getLikes = exports.deletePost = exports.createPost = exports.getPost = exports.getAllPosts = exports.getFriendsPosts = exports.getUserPosts = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const Account_1 = __importDefault(require("../models/Account"));
const FriendsData_1 = __importDefault(require("../models/FriendsData"));
async function getUserPosts(req, res, next) {
    try {
        const { params: { id: userId }, } = req;
        const posts = await Post_1.default.find({ createdBy: userId }).sort("createdAt");
        res.status(http_status_codes_1.StatusCodes.OK).json({ posts, count: posts.length });
    }
    catch (e) {
        next(e);
    }
}
exports.getUserPosts = getUserPosts;
async function getFriendsPosts(req, res, next) {
    try {
        const { user } = req;
        if (!user) {
            throw new errors_1.BadRequestError("user not found");
        }
        const friendsData = await FriendsData_1.default.findOne({ createdBy: user._id });
        const friendsPosts = await Post_1.default.find({
            createdBy: { $in: friendsData?.friendsList },
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(friendsPosts);
    }
    catch (e) {
        next(e);
    }
}
exports.getFriendsPosts = getFriendsPosts;
async function getAllPosts(req, res, next) {
    try {
        const { user } = req;
        if (!user) {
            throw new errors_1.BadRequestError("user not found");
        }
        const posts = await Post_1.default.find({ createdBy: user._id }).sort("createdAt");
        res.status(http_status_codes_1.StatusCodes.OK).json({ posts, count: posts.length });
    }
    catch (e) {
        next(e);
    }
}
exports.getAllPosts = getAllPosts;
async function getPost(req, res, next) {
    try {
        const { user, params: { id: postId }, } = req;
        const post = await Post_1.default.findOne({
            _id: postId,
        });
        if (!post) {
            throw new errors_1.NotFoundError(`No post with id ${postId}`);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(post);
    }
    catch (e) {
        next(e);
    }
}
exports.getPost = getPost;
async function createPost(req, res, next) {
    try {
        req.body.createdBy = req.user?._id;
        const post = await Post_1.default.create(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json(post);
    }
    catch (e) {
        next(e);
    }
}
exports.createPost = createPost;
async function deletePost(req, res, next) {
    try {
        const { user, params: { id: postId }, } = req;
        const post = await Post_1.default.findByIdAndDelete({
            _id: postId,
            createdBy: user?._id,
        });
        if (!post) {
            throw new errors_1.NotFoundError(`no post found with id ${postId}`);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ post });
    }
    catch (e) {
        next(e);
    }
}
exports.deletePost = deletePost;
async function getLikes(req, res, next) {
    try {
        const { user: user, params: { id: postId }, } = req;
        const post = await Post_1.default.findOne({ _id: postId });
        if (!post) {
            throw new errors_1.BadRequestError(`post not found with id ${postId}`);
        }
        const accounts = await Account_1.default.find({ createdBy: { $in: post.likes } });
        const accountsMap = {};
        accounts.forEach((account) => {
            accountsMap[account.createdBy.toString()] = account;
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ post, accountsMap });
    }
    catch (e) {
        next(e);
    }
}
exports.getLikes = getLikes;
async function likePost(req, res, next) {
    try {
        const { user, body: { postId }, } = req;
        const post = await Post_1.default.findById(postId);
        if (post) {
            const isAlreadyLiked = !!post.likes.find((id) => id.toString() === user?._id);
            if (!isAlreadyLiked) {
                post.likes.push(user?._id);
                await post.save();
            }
            else {
                console.log("already liked");
            }
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(post);
    }
    catch (e) {
        next(e);
    }
}
exports.likePost = likePost;
async function unlikePost(req, res, next) {
    try {
        const { user, body: { postId }, } = req;
        const post = await Post_1.default.findById(postId);
        if (post) {
            const isAlreadyLiked = !!post.likes.find((id) => id.toString() === user?._id);
            if (isAlreadyLiked) {
                const index = post.likes.findIndex((id) => id.toString() === user?._id);
                post.likes.splice(index, 1);
                await post.save();
            }
            else {
                console.log("already unliked");
            }
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(post);
    }
    catch (e) {
        next(e);
    }
}
exports.unlikePost = unlikePost;
