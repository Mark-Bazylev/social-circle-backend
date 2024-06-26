import { Request, Response, NextFunction } from "express";
import User, { UserDetails } from "../models/User";
import Account, { AccountDetails } from "../models/Account";
import FriendData from "../models/FriendsData";
import Posts from "../models/Post";
import Comments from "../models/Comment";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { hashPassword } from "../utils";
import { AuthenticatedRequest } from "../models";
import Post from "../models/Post";

interface UserRequest extends Request {
  body: UserDetails & AccountDetails;
}
interface AuthenticatedUserRequest extends AuthenticatedRequest {
  body: {
    newEmail?: string;
    currentPassword?: string;
    newPassword?: string;
  };
}
export async function register(
  req: UserRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password, name, coverUrl, avatarUrl } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ email, password: hashedPassword });
    await Promise.all([
      Account.create({
        name,
        coverUrl,
        avatarUrl,
        createdBy: user.id,
      }),
      FriendData.create({ createdBy: user.id }),
    ]);

    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
      user: {
        name: name,
        email: email,
        coverUrl: coverUrl,
        avatarUrl: avatarUrl,
      },
      token,
    });
  } catch (e) {
    next(e);
  }
}
export async function login(
  req: UserRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
      user: {
        email: user.email,
        id: user.id,
      },
      token,
    });
  } catch (e) {
    next(e);
  }
}

export async function getUserEmail(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { user } = req;
    if (!user?._id) {
      throw new BadRequestError("Please provide user Id");
    }
    const currentUser = await User.findById(user._id);
    res.status(StatusCodes.OK).json({ email: currentUser?.email });
  } catch (e) {
    next(e);
  }
}
export async function changeEmail(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      body: { newEmail },
    } = req;
    if (!newEmail) {
      throw new BadRequestError("Please provide new Email");
    }

    const alreadyExistingEmail = await User.findOne({ email: newEmail });
    if (alreadyExistingEmail) {
      throw new BadRequestError("Email Already Exists");
    }
    const currentUser = await User.findById(user?._id);
    if (!currentUser) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    currentUser.email = newEmail;
    currentUser.save();

    res.status(StatusCodes.OK).json(currentUser);
  } catch (e) {
    next(e);
  }
}
export async function changePassword(
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      body: { currentPassword, newPassword },
    } = req;

    if (!currentPassword || !newPassword) {
      throw new BadRequestError(
        "Please provide Current Password and New Password",
      );
    }
    const currentUser = await User.findById(user?._id);

    if (!currentUser) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const isPasswordCorrect =
      await currentUser.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const hashedPassword = await hashPassword(newPassword);

    if (hashedPassword) {
      currentUser.password = hashedPassword;
      currentUser.save();
    }
    res.status(StatusCodes.OK).json(currentUser);
  } catch (e) {
    next(e);
  }
}
export async function deleteUser(
    req: AuthenticatedUserRequest,
    res: Response,
    next: NextFunction,
) {
  try {
    const {user} = req;
    if (!user) {
      throw new UnauthenticatedError("User not found");
    }
    const account = await Account.findOneAndDelete({createdBy: user._id});

    await Promise.all([
      User.findByIdAndDelete(user._id),
      FriendData.findOneAndDelete({createdBy: user._id}),
      Post.deleteMany({createdBy: user._id}),
      Post.updateMany({likes: user._id}, {$pull: {likes: user._id}}),
      FriendData.updateMany(
          {
            $or: [
              {sentRequests: user._id},
              {receivedRequests: user._id},
              {friendsList: user._id},
            ],
          },
          {
            $pull: {
              sentRequests: user._id,
              receivedRequests: user._id,
              friendsList: user._id,
            },
          },
      ),
    ]);

    res.status(StatusCodes.OK).json({msg: "User deleted successfully"});
  } catch (e) {
    next(e);
  }
}