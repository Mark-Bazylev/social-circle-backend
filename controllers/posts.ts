import { Request, Response, NextFunction } from "express";

import Post from "../models/Post";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import Account, { AccountDetails } from "../models/Account";
import FriendsData from "../models/FriendsData";
import { AuthenticatedRequest } from "../models";
import { ObjectId } from "mongoose";

export async function getUserPosts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      params: { id: userId },
    } = req;
    const posts = await Post.find({ createdBy: userId }).sort("createdAt");
    res.status(StatusCodes.OK).json({ posts, count: posts.length });
  } catch (e) {
    next(e);
  }
}
export async function getFriendsPosts(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { user } = req;
    if (!user) {
      throw new BadRequestError("user not found");
    }
    const friendsData = await FriendsData.findOne({ createdBy: user._id });
    const friendsPosts = await Post.find({
      createdBy: { $in: friendsData?.friendsList },
    });
    res.status(StatusCodes.OK).json(friendsPosts);
  } catch (e) {
    next(e);
  }
}
export async function getAllPosts(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { user } = req;
    if (!user) {
      throw new BadRequestError("user not found");
    }
    const posts = await Post.find({ createdBy: user._id }).sort("createdAt");

    res.status(StatusCodes.OK).json({ posts, count: posts.length });
  } catch (e) {
    next(e);
  }
}
export async function getPost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      params: { id: postId },
    } = req;

    const post = await Post.findOne({
      _id: postId,
    });
    if (!post) {
      throw new NotFoundError(`No post with id ${postId}`);
    }

    res.status(StatusCodes.OK).json(post);
  } catch (e) {
    next(e);
  }
}
export async function createPost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    req.body.createdBy = req.user?._id;
    const post = await Post.create(req.body);
    res.status(StatusCodes.CREATED).json(post);
  } catch (e) {
    next(e);
  }
}

export async function deletePost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      params: { id: postId },
    } = req;

    const post = await Post.findByIdAndDelete({
      _id: postId,
      createdBy: user?._id,
    });

    if (!post) {
      throw new NotFoundError(`no post found with id ${postId}`);
    }

    res.status(StatusCodes.OK).json({ post });
  } catch (e) {
    next(e);
  }
}
export async function getLikes(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user: user,
      params: { id: postId },
    } = req;
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      throw new BadRequestError(`post not found with id ${postId}`);
    }
    const accounts = await Account.find({ createdBy: { $in: post.likes } });
    const accountsMap: Record<string, AccountDetails> = {};
    accounts.forEach((account) => {
      accountsMap[account.createdBy.toString()] = account;
    });

    res.status(StatusCodes.OK).json({ post, accountsMap });
  } catch (e) {
    next(e);
  }
}
export async function likePost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      body: { postId },
    } = req;
    const post = await Post.findById(postId);
    if (post) {
      const isAlreadyLiked = !!post.likes.find(
        (id) => id.toString() === (user?._id as unknown as string),
      );
      if (!isAlreadyLiked) {
        post.likes.push(user?._id as ObjectId);
        await post.save();
      } else {
        console.log("already liked");
      }
    }
    res.status(StatusCodes.OK).json(post);
  } catch (e) {
    next(e);
  }
}
export async function unlikePost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      body: { postId },
    } = req;
    const post = await Post.findById(postId);
    if (post) {
      const isAlreadyLiked = !!post.likes.find(
        (id) => id.toString() === (user?._id as unknown as string),
      );

      if (isAlreadyLiked) {
        const index = post.likes.findIndex(
          (id) => id.toString() === (user?._id as unknown as string),
        );
        post.likes.splice(index, 1);
        await post.save();
      } else {
        console.log("already unliked");
      }
    }
    res.status(StatusCodes.OK).json(post);
  } catch (e) {
    next(e);
  }
}
