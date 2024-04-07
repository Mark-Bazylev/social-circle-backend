import { StatusCodes } from "http-status-codes";
import Account from "../models/Account";
import { BadRequestError } from "../errors";
import { Response, NextFunction } from "express";
import {AuthenticatedRequest} from "../models";

export async function getAllAccounts(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { user } = req;

    const accounts = await Account.find({ createdBy: { $ne: user?._id } }).sort(
      "createdAt",
    );
    res.status(StatusCodes.OK).json({ accounts, count: accounts.length });
  } catch (e) {
    next(e);
  }
}
export async function getAccount(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      params: { id },
    } = req;
    const account = await Account.findOne({
      createdBy: id,
    }).sort("createdAt");
    res.status(StatusCodes.OK).json(account);
  } catch (e) {
    next(e);
  }
}

export async function editAccount(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      body: {newName, newAvatarUrl, newCoverUrl},
      user,
    } = req;
    if (Object.keys(req.body).length === 0) {
      throw new BadRequestError(
          "Please Provide newName or newAvatarUrl or newCoveUrl",
      );
    }
    const account = await Account.findOne({createdBy: user?._id});

    if(account) {
      if (newName) account.name = newName;
      if (newAvatarUrl) account.avatarUrl = newAvatarUrl;
      if (newCoverUrl) account.coverUrl = newCoverUrl;
      account.save();
    }
    res.status(StatusCodes.OK).json(account);
  }
  catch (e) {
    next(e)
  }
}
