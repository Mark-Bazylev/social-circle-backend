"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.changePassword = exports.changeEmail = exports.getUserEmail = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const Account_1 = __importDefault(require("../models/Account"));
const FriendsData_1 = __importDefault(require("../models/FriendsData"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
const Post_1 = __importDefault(require("../models/Post"));
async function register(req, res, next) {
    try {
        const { email, password, name, coverUrl, avatarUrl } = req.body;
        const hashedPassword = await (0, utils_1.hashPassword)(password);
        const user = await User_1.default.create({ email, password: hashedPassword });
        await Promise.all([
            Account_1.default.create({
                name,
                coverUrl,
                avatarUrl,
                createdBy: user.id,
            }),
            FriendsData_1.default.create({ createdBy: user.id }),
        ]);
        const token = user.createJWT();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            user: {
                name: name,
                email: email,
                coverUrl: coverUrl,
                avatarUrl: avatarUrl,
            },
            token,
        });
    }
    catch (e) {
        next(e);
    }
}
exports.register = register;
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new errors_1.BadRequestError("Please provide email and password");
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            throw new errors_1.UnauthenticatedError("Invalid Credentials");
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            throw new errors_1.UnauthenticatedError("Invalid Credentials");
        }
        const token = user.createJWT();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            user: {
                email: user.email,
                id: user.id,
            },
            token,
        });
    }
    catch (e) {
        next(e);
    }
}
exports.login = login;
async function getUserEmail(req, res, next) {
    try {
        const { user } = req;
        if (!user?._id) {
            throw new errors_1.BadRequestError("Please provide user Id");
        }
        const currentUser = await User_1.default.findById(user._id);
        res.status(http_status_codes_1.StatusCodes.OK).json({ email: currentUser?.email });
    }
    catch (e) {
        next(e);
    }
}
exports.getUserEmail = getUserEmail;
async function changeEmail(req, res, next) {
    try {
        const { user, body: { newEmail }, } = req;
        if (!newEmail) {
            throw new errors_1.BadRequestError("Please provide new Email");
        }
        const alreadyExistingEmail = await User_1.default.findOne({ email: newEmail });
        if (alreadyExistingEmail) {
            throw new errors_1.BadRequestError("Email Already Exists");
        }
        const currentUser = await User_1.default.findById(user?._id);
        if (!currentUser) {
            throw new errors_1.UnauthenticatedError("Invalid Credentials");
        }
        currentUser.email = newEmail;
        currentUser.save();
        res.status(http_status_codes_1.StatusCodes.OK).json(currentUser);
    }
    catch (e) {
        next(e);
    }
}
exports.changeEmail = changeEmail;
async function changePassword(req, res, next) {
    try {
        const { user, body: { currentPassword, newPassword }, } = req;
        if (!currentPassword || !newPassword) {
            throw new errors_1.BadRequestError("Please provide Current Password and New Password");
        }
        const currentUser = await User_1.default.findById(user?._id);
        if (!currentUser) {
            throw new errors_1.UnauthenticatedError("Invalid Credentials");
        }
        const isPasswordCorrect = await currentUser.comparePassword(currentPassword);
        if (!isPasswordCorrect) {
            throw new errors_1.UnauthenticatedError("Invalid Credentials");
        }
        const hashedPassword = await (0, utils_1.hashPassword)(newPassword);
        if (hashedPassword) {
            currentUser.password = hashedPassword;
            currentUser.save();
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(currentUser);
    }
    catch (e) {
        next(e);
    }
}
exports.changePassword = changePassword;
async function deleteUser(req, res, next) {
    try {
        const { user } = req;
        if (!user) {
            throw new errors_1.UnauthenticatedError("User not found");
        }
        const account = await Account_1.default.findOneAndDelete({ createdBy: user._id });
        await Promise.all([
            User_1.default.findByIdAndDelete(user._id),
            FriendsData_1.default.findOneAndDelete({ createdBy: user._id }),
            Post_1.default.deleteMany({ createdBy: user._id }),
            Post_1.default.updateMany({ likes: user._id }, { $pull: { likes: user._id } }),
            FriendsData_1.default.updateMany({
                $or: [
                    { sentRequests: user._id },
                    { receivedRequests: user._id },
                    { friendsList: user._id },
                ],
            }, {
                $pull: {
                    sentRequests: user._id,
                    receivedRequests: user._id,
                    friendsList: user._id,
                },
            }),
        ]);
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "User deleted successfully" });
    }
    catch (e) {
        next(e);
    }
}
exports.deleteUser = deleteUser;
