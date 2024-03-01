const { StatusCodes } = require("http-status-codes");
const Account = require("../models/Account");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const createComment = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const comment = await Comment.create(req.body);
  const post = await Post.findById(req.body.commentedIn);
  post.commentsLength++;
  post.save()
  res.status(StatusCodes.CREATED).json(comment);
};
const getMyComments = async (req, res) => {
  const {
    user: { userId },
  } = req;
  const comments = await Comment.find({ createdBy: userId });
  res.status(StatusCodes.OK).json(comments);
};

const getPostComments = async (req, res) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  const comments = await Comment.find({ commentedIn: postId });
  const createdByIdArray = [];
  comments.forEach((comment) => createdByIdArray.push(comment.createdBy));
  const accounts = await Account.find({ createdBy: { $in: createdByIdArray } });
  const accountsMap = {};
  accounts.forEach((account) => (accountsMap[account.createdBy] = account));
  res.status(StatusCodes.OK).json({ comments, accountsMap });
};

const getComment = async (req, res) => {
  const {
    user: { userId },
    params: { id: commentId },
  } = req;

  const comment = await Comment.findById(commentId);

  res.status(StatusCodes.OK).json(comment);
};
const getCommentLikes = async (req, res) => {
  const {
    user: { userId },
    params: { id: commentId },
  } = req;
  const comment = await Comment.findById(commentId);
  const accounts = await Account.find({ createdBy: { $in: comment.likes } });
  const accountsMap = {};
  accounts.forEach((account) => {
    accountsMap[account.createdBy] = account;
  });

  res.status(StatusCodes.OK).json({ comment, accountsMap });
};

const likeComment = async (req, res) => {
  const {
    user: { userId },
    body: { commentId },
  } = req;

  const comment = await Comment.findById(commentId);

  const isAlreadyLiked = !!comment.likes.find((id) => id.toString() === userId);
  if (!isAlreadyLiked) {
    comment.likes.push(userId);
    await comment.save();
  } else {
    console.log("already liked");
  }
  console.log(commentId);
  res.status(StatusCodes.OK).json(comment);
};
const unlikeComment = async (req, res) => {
  const {
    user: { userId },
    body: { commentId },
  } = req;
  const comment = await Comment.findById(commentId);
  const isAlreadyLiked = !!comment.likes.find((id) => id.toString() === userId);

  if (isAlreadyLiked) {
    const index = comment.likes.findIndex((id) => id.toString() === userId);
    comment.likes.splice(index, 1);
    await comment.save();
  } else {
    console.log("already unliked");
  }

  res.status(StatusCodes.OK).json(comment);
};
//add update and delete options

module.exports = {
  createComment,
  getComment,
  getPostComments,
  getMyComments,
  getCommentLikes,
  likeComment,
  unlikeComment,
};
