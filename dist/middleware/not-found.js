"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
function default_1(req, res) {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("Route does not exist");
}
exports.default = default_1;
