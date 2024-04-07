"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptFriendRequest = exports.sendFriendRequest = exports.getFriendsData = void 0;
const http_status_codes_1 = require("http-status-codes");
const Account_1 = __importDefault(require("../models/Account"));
const errors_1 = require("../errors");
const FriendsData_1 = __importDefault(require("../models/FriendsData"));
async function getFriendsData(req, res, next) {
    try {
        const { user } = req;
        if (!user) {
            throw new errors_1.BadRequestError("user not found");
        }
        const friendsData = await FriendsData_1.default.findOne({ createdBy: user._id });
        if (!friendsData) {
            throw new errors_1.BadRequestError("friend Data doesnt exist");
        }
        const accountsIds = [
            ...friendsData.friendsList,
            ...friendsData.sentRequests,
            ...friendsData.receivedRequests,
        ];
        const accounts = await Account_1.default.find({ createdBy: { $ne: user._id } });
        const potentialFriends = [];
        const accountsMap = {};
        accounts.forEach((account) => {
            accountsMap[account.createdBy.toString()] = account;
            //this should contain a list of people you may know according to matrix of similar interests and location.
            //this is out of scope for this project
            if (accountsIds.findIndex((id) => id.toString() === account.createdBy.toString()) === -1) {
                potentialFriends.push(account.createdBy);
            }
        });
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ friendsData, accountsIds, potentialFriends, accountsMap });
    }
    catch (e) {
        next(e);
    }
}
exports.getFriendsData = getFriendsData;
async function sendFriendRequest(req, res, next) {
    try {
        const { user, body: { requestedUserId }, } = req;
        if (!user || !user._id) {
            throw new errors_1.BadRequestError("user not found");
        }
        const friendsData = await FriendsData_1.default.findOne({ createdBy: user._id });
        if (!friendsData) {
            throw new errors_1.BadRequestError("friend Data doesnt exist");
        }
        if (!friendsData.sentRequests.some((id) => id.toString() === requestedUserId)) {
            friendsData.sentRequests.push(requestedUserId);
        }
        const receivingFriendRequest = await FriendsData_1.default.findOne({
            createdBy: requestedUserId,
        });
        if (!receivingFriendRequest) {
            throw new errors_1.BadRequestError("receiving friend data not found");
        }
        if (!receivingFriendRequest.receivedRequests.some((id) => id.toString() === user._id?.toString())) {
            receivingFriendRequest.receivedRequests.push(user._id);
        }
        await friendsData.save();
        await receivingFriendRequest.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({ friendsData, receivingFriendRequest });
    }
    catch (e) {
        next(e);
    }
}
exports.sendFriendRequest = sendFriendRequest;
async function acceptFriendRequest(req, res, next) {
    try {
        const { user, body: { acceptedUserId }, } = req;
        if (!user) {
            throw new errors_1.BadRequestError("user not found");
        }
        const friendsData = await FriendsData_1.default.findOne({ createdBy: user._id });
        const otherFriendRequest = await FriendsData_1.default.findOne({
            createdBy: acceptedUserId,
        });
        if (!friendsData || !otherFriendRequest) {
            throw new errors_1.BadRequestError("friend data or friendRequest was not found");
        }
        const requestIndex = friendsData.receivedRequests.findIndex((id) => id.toString() === acceptedUserId);
        const otherRequestIndex = otherFriendRequest.sentRequests.findIndex((id) => id.toString() === user._id?.toString());
        if (requestIndex != -1 && otherRequestIndex != -1) {
            const [receivedRequestId] = friendsData.receivedRequests.splice(requestIndex, 1);
            const [sentRequestId] = otherFriendRequest.sentRequests.splice(otherRequestIndex, 1);
            //putting in friends list array
            friendsData.friendsList.push(receivedRequestId);
            otherFriendRequest.friendsList.push(sentRequestId);
        }
        await friendsData.save();
        await otherFriendRequest.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({ friendsData, otherFriendRequest });
    }
    catch (e) {
        next(e);
    }
}
exports.acceptFriendRequest = acceptFriendRequest;
