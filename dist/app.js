"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Configuring dotenv before imports to avoid premature access to env vars.
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
// Security Packages
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const connect_1 = __importDefault(require("./db/connect"));
// Middleware
const authentication_1 = __importDefault(require("./middleware/authentication"));
// Routers
const auth_1 = __importDefault(require("./routes/auth"));
const posts_1 = __importDefault(require("./routes/posts"));
const accounts_1 = __importDefault(require("./routes/accounts"));
const friendsData_1 = __importDefault(require("./routes/friendsData"));
const comments_1 = __importDefault(require("./routes/comments"));
const chat_1 = __importDefault(require("./routes/chat"));
// Error Handler
const not_found_1 = __importDefault(require("./middleware/not-found"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const socket_1 = require("./socket");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, //15 minutes
//     limit: 100, //limit each IP to 100 requests per windowMs
//   }),
// );
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
//Static File Route
app.use("/assets", express_1.default.static("assets"));
//Routes
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/posts", authentication_1.default, posts_1.default);
app.use("/api/v1/accounts", authentication_1.default, accounts_1.default);
app.use("/api/v1/friendsRequest", authentication_1.default, friendsData_1.default);
app.use("/api/v1/comments", authentication_1.default, comments_1.default);
app.use("/api/v1/chat", authentication_1.default, chat_1.default);
app.use(not_found_1.default);
app.use(error_handler_1.default);
const server = (0, http_1.createServer)(app);
const start = async () => {
    try {
        await (0, connect_1.default)(process.env.MONGO_URI);
        (0, socket_1.initializeSocket)(server);
        server.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
    }
    catch (error) {
        console.log(error);
    }
};
start();
