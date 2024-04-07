"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomApiError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message || "Internal Server Error");
        this.statusCode = statusCode || 500;
    }
}
exports.default = CustomApiError;
