"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const accounts_1 = require("../controllers/accounts");
router.route("/").get(accounts_1.getAllAccounts);
router.route("/:id").get(accounts_1.getAccount);
router.route("/edit").patch(accounts_1.editAccount);
exports.default = router;
