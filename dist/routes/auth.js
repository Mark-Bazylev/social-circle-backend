"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authentication_1 = __importDefault(require("../middleware/authentication"));
const auth_1 = require("../controllers/auth");
router.route("/register").post(auth_1.register);
router.route("/login").post(auth_1.login);
router
    .route("/email")
    .get(authentication_1.default, auth_1.getUserEmail)
    .patch(authentication_1.default, auth_1.changeEmail);
router.route("/password").patch(authentication_1.default, auth_1.changePassword);
router.route("/delete").delete(authentication_1.default, auth_1.deleteUser);
exports.default = router;
