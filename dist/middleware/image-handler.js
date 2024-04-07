"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, "../../", process.env.IMAGE_UPLOAD_PATH)); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        if (file) {
            const fileId = (0, uuid_1.v4)();
            const uniqueImageName = fileId + path_1.default.extname(file.originalname);
            file.originalname = uniqueImageName;
            cb(null, uniqueImageName);
        }
    },
});
const multerUpload = (0, multer_1.default)({ storage: storage });
exports.multerUpload = multerUpload;
