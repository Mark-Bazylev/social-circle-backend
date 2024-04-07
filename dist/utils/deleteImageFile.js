"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function deleteImageFile(imageName) {
    const filePath = path_1.default.join(__dirname, "../../", process.env.IMAGE_UPLOAD_PATH, imageName);
    fs_1.default.unlink(filePath, (err) => {
        if (err) {
            console.error("Error deleting file:", err);
            return;
        }
        console.log("Image file deleted successfully:", filePath);
    });
}
exports.deleteImageFile = deleteImageFile;
