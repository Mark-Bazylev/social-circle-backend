const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const FriendsData = require("../models/FriendsData");
const Account = require("../models/Account");

const getUserPosts = async (req, res) => {
  const {
    params: { id: userId },
  } = req;
  const posts = await Post.find({ createdBy: userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ posts, count: posts.length });
};
const getFriendsPosts = async (req, res) => {
  const {
    user: { userId },
  } = req;
  const friendsData = await FriendsData.findOne({ createdBy: userId });
  const friendsPosts = await Post.find({
    createdBy: { $in: friendsData.friendsList },
  });
  res.status(StatusCodes.OK).json(friendsPosts);
};
const getAllPosts = async (req, res) => {
  const {
    user: { userId },
  } = req;

  const posts = await Post.find({ createdBy: userId }).sort("createdAt");

  res.status(StatusCodes.OK).json({ posts, count: posts.length });
};

const getPost = async (req, res) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  const post = await Post.findOne({
    _id: postId,
  });
  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }

  res.status(StatusCodes.OK).json(post);
};

const createPost = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const post = await Post.create(req.body);

  res.status(StatusCodes.CREATED).json(post);
};

const deletePost = async (req, res) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  const post = await Post.findByIdAndRemove({ _id: postId, createdBy: userId });

  if (!post) {
    throw new NotFoundError(`no job with id ${postId}`);
  }

  res.status(StatusCodes.OK).json({ post });
};
const getLikes = async (req, res) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;
  const post = await Post.findOne({ _id: postId });
  const accounts = await Account.find({ createdBy: { $in: post.likes } });
  const accountsMap = {};
  accounts.forEach((account) => {
    accountsMap[account.createdBy] = account;
  });

  res.status(StatusCodes.OK).json({ post, accountsMap });
};
const likePost = async (req, res) => {
  const {
    user: { userId },
    body: { postId },
  } = req;
  const post = await Post.findById(postId);
  const isAlreadyLiked = !!post.likes.find((id) => id.toString() === userId);
  if (!isAlreadyLiked) {
    post.likes.push(userId);
    await post.save();
  } else {
    console.log("already liked");
  }
  console.log(postId);
  res.status(StatusCodes.OK).json(post);
};
const unlikePost = async (req, res) => {
  const {
    user: { userId },
    body: { postId },
  } = req;
  const post = await Post.findById(postId);
  const isAlreadyLiked = !!post.likes.find((id) => id.toString() === userId);

  if (isAlreadyLiked) {
    const index = post.likes.findIndex((id) => id.toString() === userId);
    post.likes.splice(index, 1);
    await post.save();
  } else {
    console.log("already unliked");
  }
  console.log(postId);

  res.status(StatusCodes.OK).json(post);
};

module.exports = {
  getAllPosts,
  getFriendsPosts,
  getUserPosts,
  getPost,
  getLikes,
  createPost,
  deletePost,
  likePost,
  unlikePost,
};
