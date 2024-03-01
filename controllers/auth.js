const User = require("../models/User");
const Account = require("../models/Account");
const FriendData = require("../models/FriendsData");
const Posts = require("../models/Post");
const Comments = require("../models/Comment");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
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
};
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("got here");
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  //compare password
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    console.log("invalid password");
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
};

const getUserEmail = async (req, res) => {
  const {
    user: { userId },
  } = req;
  console.log(userId);
  if (!userId) {
    throw new BadRequestError("Please provide user Id");
  }
  const user = await User.findById(userId);
  res.status(StatusCodes.OK).json({ email: user.email });
};
const changeEmail = async (req, res) => {
  const {
    body: { newEmail },
    user: { userId },
  } = req;
  if (!newEmail) {
    throw new BadRequestError("Please provide new Email");
  }

  const alreadyExistingEmail = await User.findOne({ email: newEmail });
  if (alreadyExistingEmail) {
    throw new BadRequestError("Email Already Exists");
  }

  const user = await User.findById(userId);
  console.log(newEmail);
  console.log(user, "THIS IS A FKIN CONOSOLE LOGGGEDDDDD");
  user.email = newEmail;
  user.save();
  res.status(StatusCodes.OK).json(user);
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  console.log(req.body);

  if (!currentPassword || !newPassword) {
    throw new BadRequestError(
      "Please provide Current Password and New Password"
    );
  }
  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  user.save();
  res.status(StatusCodes.OK).json(user);
};

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
const deleteUser = async (req, res) => {
  const {
    user: { userId },
  } = req;
  await Promise.all([
    User.findByIdAndRemove(userId),
    Account.findOneAndRemove({ createdBy: userId }),
    FriendData.findOneAndRemove({ createdBy: userId }),
    Posts.deleteMany({ createdBy: userId }),
    Comments.deleteMany({ createdBy: userId }),

    Posts.updateMany({ likes: userId }, { $pull: { likes: userId } }),
    FriendData.updateMany(
      {
        $or: [
          { sentRequests: userId },
          { receivedRequests: userId },
          { friendsList: userId },
        ],
      },
      {
        $pull: {
          sentRequests: userId,
          receivedRequests: userId,
          friendsList: userId,
        },
      }
    ),
  ]);

  res.status(StatusCodes.OK).json({ msg: "User deleted successfully" });
};

module.exports = {
  register,
  login,
  getUserEmail,
  changeEmail,
  changePassword,
  deleteUser,
};
