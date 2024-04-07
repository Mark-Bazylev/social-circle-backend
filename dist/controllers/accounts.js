"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editAccount = exports.getAccount = exports.getAllAccounts = void 0;
const http_status_codes_1 = require("http-status-codes");
const Account_1 = __importDefault(require("../models/Account"));
const errors_1 = require("../errors");
async function getAllAccounts(req, res, next) {
    try {
        const { user } = req;
        const accounts = await Account_1.default.find({ createdBy: { $ne: user?._id } }).sort("createdAt");
        res.status(http_status_codes_1.StatusCodes.OK).json({ accounts, count: accounts.length });
    }
    catch (e) {
        next(e);
    }
}
exports.getAllAccounts = getAllAccounts;
async function getAccount(req, res, next) {
    try {
        const { user, params: { id }, } = req;
        const account = await Account_1.default.findOne({
            createdBy: id,
        }).sort("createdAt");
        res.status(http_status_codes_1.StatusCodes.OK).json(account);
    }
    catch (e) {
        next(e);
    }
}
exports.getAccount = getAccount;
async function editAccount(req, res, next) {
    try {
        const { body: { newName, newAvatarUrl, newCoverUrl }, user, } = req;
        if (Object.keys(req.body).length === 0) {
            throw new errors_1.BadRequestError("Please Provide newName or newAvatarUrl or newCoveUrl");
        }
        const account = await Account_1.default.findOne({ createdBy: user?._id });
        if (account) {
            if (newName)
                account.name = newName;
            if (newAvatarUrl)
                account.avatarUrl = newAvatarUrl;
            if (newCoverUrl)
                account.coverUrl = newCoverUrl;
            account.save();
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(account);
    }
    catch (e) {
        next(e);
    }
}
exports.editAccount = editAccount;
