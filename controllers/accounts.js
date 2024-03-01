const { StatusCodes } = require("http-status-codes");
const Account = require("../models/Account");
const { BadRequestError } = require("../errors");

const getAllAccounts = async (req, res) => {
  const {
    user: { userId },
  } = req;

  const accounts = await Account.find({ createdBy: { $ne: userId } }).sort(
    "createdAt"
  );
  console.log("this is req.user", userId);
  res.status(StatusCodes.OK).json({ accounts, count: accounts.length });
};
const getAccount = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;
  const account = await Account.findOne({
    createdBy: id,
  }).sort("createdAt");
  res.status(StatusCodes.OK).json(account);
};

const editAccount = async (req, res) => {
  const {
    body: { newName, newAvatarUrl, newCoverUrl },
    user: { userId },
  } = req;
  if (Object.keys(req.body).length === 0) {
    throw new BadRequestError(
      "Please Provide newName or newAvatarUrl or newCoveUrl"
    );
  }
  const account = await Account.findOne({ createdBy: userId });

  if (newName) account.name = newName;
  if (newAvatarUrl) account.avatarUrl = newAvatarUrl;
  if (newCoverUrl) account.coverUrl = newCoverUrl;
  account.save();
  res.status(StatusCodes.OK).json(account);
};

module.exports = {
  getAllAccounts,
  getAccount,
  editAccount,
};
