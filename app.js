require("dotenv").config();
require("express-async-errors");

//Extra Security Packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();
//Connect Database
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

//Routers
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const accountsRouter = require("./routes/accounts");
const friendsDataRouter = require("./routes/friendsData");
const commentsRouter = require("./routes/comments");
const chatRouter=require("./routes/chat")

//Error Handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const initializeSocket = require("./socket");
const {createServer} = require("http");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, //limit each IP to 100 requests per windowMs
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", authenticateUser, postsRouter);
app.use("/api/v1/accounts", authenticateUser, accountsRouter);
app.use("/api/v1/friendsRequest", authenticateUser, friendsDataRouter);
app.use("/api/v1/comments", authenticateUser, commentsRouter);
app.use("/api/v1/chat", authenticateUser, chatRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const server= createServer(app)


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    initializeSocket(server)
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
