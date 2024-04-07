"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeComment = exports.likeComment = exports.getCommentLikes = exports.getComment = exports.getPostComments = exports.getMyComments = exports.createComment = void 0;
const http_status_codes_1 = require("http-status-codes");
const Account_1 = __importDefault(require("../models/Account"));
const Comment_1 = __importDefault(require("../models/Comment"));
const Post_1 = __importDefault(require("../models/Post"));
const errors_1 = require("../errors");
async function createComment(req, res, next) {
    try {
        const { user, body: { commentedIn }, } = req;
        if (!user) {
            throw new errors_1.BadRequestError("user not found");
        }
        req.body.createdBy = user._id;
        const post = await Post_1.default.findById(commentedIn);
        if (!post) {
            throw new errors_1.BadRequestError(`commentedIn not found. commentedIn:${commentedIn}`);
        }
        const comment = await Comment_1.default.create(req.body);
        post.commentsLength++;
        post.save();
        res.status(http_status_codes_1.StatusCodes.CREATED).json(comment);
    }
    catch (e) {
        next(e);
    }
}
exports.createComment = createComment;
async function getMyComments(req, res, next) {
    const { user } = req;
    const comments = await Comment_1.default.find({ createdBy: user?._id });
    res.status(http_status_codes_1.StatusCodes.OK).json(comments);
}
exports.getMyComments = getMyComments;
async function getPostComments(req, res, next) {
    try {
        const { user, params: { id: postId }, } = req;
        const comments = await Comment_1.default.find({ commentedIn: postId });
        const createdByIdArray = [];
        comments.forEach((comment) => createdByIdArray.push(comment.createdBy));
        const accounts = await Account_1.default.find({
            createdBy: { $in: createdByIdArray },
        });
        const accountsMap = {};
        accounts.forEach((account) => (accountsMap[account.createdBy.toString()] = account));
        res.status(http_status_codes_1.StatusCodes.OK).json({ comments, accountsMap });
    }
    catch (e) {
        next(e);
    }
}
exports.getPostComments = getPostComments;
async function getComment(req, res, next) {
    try {
        const { user, params: { id: commentId }, } = req;
        const comment = await Comment_1.default.findById(commentId);
        res.status(http_status_codes_1.StatusCodes.OK).json(comment);
    }
    catch (e) {
        next(e);
    }
}
exports.getComment = getComment;
async function getCommentLikes(req, res, next) {
    try {
        const { user, params: { id: commentId }, } = req;
        const comment = await Comment_1.default.findById(commentId);
        if (!comment) {
            throw new errors_1.BadRequestError(`comment not found with comment Id: ${commentId}`);
        }
        const accounts = await Account_1.default.find({ createdBy: { $in: comment.likes } });
        const accountsMap = {};
        accounts.forEach((account) => {
            accountsMap[account.createdBy.toString()] = account;
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ comment, accountsMap });
    }
    catch (e) {
        next(e);
    }
}
exports.getCommentLikes = getCommentLikes;
async function likeComment(req, res, next) {
    try {
        const { user, body: { commentId }, } = req;
        const comment = await Comment_1.default.findById(commentId);
        if (comment && user) {
            const isAlreadyLiked = !!comment.likes.find((id) => id.toString() === user._id);
            if (!isAlreadyLiked) {
                comment.likes.push(user?._id);
                await comment.save();
            }
            else {
                console.log("already liked");
            }
            console.log(commentId);
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(comment);
    }
    catch (e) {
        next(e);
    }
}
exports.likeComment = likeComment;
async function unlikeComment(req, res, next) {
    try {
        const { user, body: { commentId }, } = req;
        const comment = await Comment_1.default.findById(commentId);
        if (comment) {
            const isAlreadyLiked = !!comment.likes.find((id) => id.toString() === user?._id);
            if (isAlreadyLiked) {
                const index = comment.likes.findIndex((id) => id.toString() === user?._id);
                comment.likes.splice(index, 1);
                await comment.save();
            }
            else {
                console.log("already unliked");
            }
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(comment);
    }
    catch (e) {
        next(e);
    }
}
exports.unlikeComment = unlikeComment;
//add update and delete options
