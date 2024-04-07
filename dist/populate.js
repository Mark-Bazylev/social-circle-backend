"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const connectDB = require("./db/connect");
const User = require("./models/User");
const Account = require("./models/Account");
const FriendData = require("./models/FriendsData");
const Posts = require("./models/Post");
const Comments = require("./models/Comment");
const jsonUsers = require("./users.json");
const bcrypt = require("bcryptjs");
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Promise.all([
            User.deleteMany(),
            Account.deleteMany(),
            FriendData.deleteMany(),
            Posts.deleteMany(),
            Comments.deleteMany(),
        ]);
        for (let i = 0; i < jsonUsers.length; i++) {
            const hashedPassword = await hashPassword(jsonUsers[i].User.password);
            const user = await User.create({
                email: jsonUsers[i].User.email,
                password: hashedPassword,
            });
            await Promise.all([
                Account.create({ ...jsonUsers[i].Account, createdBy: user._id }),
                FriendData.create({ createdBy: user._id }),
            ]);
        }
        console.log("Success!!!!");
        process.exit(0);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
start();
