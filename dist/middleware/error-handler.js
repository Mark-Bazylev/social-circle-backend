"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../utils");
const errorHandlerMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let message = err.message || "Internal Server Error";
    if (err.name === "ValidationError") {
        statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        message = err.message;
    }
    if (err.name === "CastError") {
        message = `No item found with id : ${err.value}`;
        statusCode = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
    if (err.code && err.code === 11000) {
        const duplicateErrorKeyString = (0, utils_1.capitalizeFirstLetter)(Object.keys(err.keyValue)[0]);
        message = `${duplicateErrorKeyString} is already taken`;
        statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    res.status(statusCode).json({
        message,
    });
};
exports.default = errorHandlerMiddleware;
