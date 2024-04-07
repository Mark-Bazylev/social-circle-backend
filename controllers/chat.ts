import ChatMessages from "../models/ChatMessage";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../models";
import FriendsData from "../models/FriendsData";

export async function getLastChatMessages(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { user } = req;
    const friendsData = await FriendsData.findOne({ createdBy: user?._id });
    const chatMessages = await ChatMessages.find({
      createdBy: { $in: friendsData?.friendsList },
    });
    res.status(StatusCodes.OK).json({ userId: user?._id, chatMessages });
  } catch (e) {
    next(e);
  }
}
export async function getChatMessagesByPage(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      query: { pageIndex, userId, otherUserId },
    } = req;
    if (!pageIndex || !userId || !otherUserId)
      throw new BadRequestError("missing query params");
    const pageSize = 10;
    const offset = ((pageIndex as unknown as number) - 1) * pageSize;
    const roomId =
      userId.toString().localeCompare(otherUserId.toString()) <= 0
        ? `${userId}|${otherUserId}`
        : `${otherUserId}|${userId}`;

    const chatMessages = await ChatMessages.find({ room: roomId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(pageSize);
    if (!chatMessages) {
      throw new BadRequestError("couldn't find chat messages");
    }
    res.status(StatusCodes.OK).json(chatMessages);
  } catch (e) {
    next(e);
  }
}
