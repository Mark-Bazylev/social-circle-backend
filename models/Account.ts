

import mongoose, { Document, ObjectId } from "mongoose";
// Account schema fields
export interface AccountDetails {
    _id?: ObjectId;
    createdBy: ObjectId;
    name: string;
    coverUrl: string;
    avatarUrl: string;
}
interface AccountDocument extends AccountDetails, Document<ObjectId> {
    // Account schema methods
}
const AccountSchema = new mongoose.Schema<AccountDocument>(
    {
        createdBy: {
            unique: true,
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user"],
        },
        name: {
            type: String,
            required: [true, "Please provide name"],
            minlength: 3,
            maxlength: 50,
        },
        coverUrl: {
            type: String,
            required: [true, "Please provide cover Image"],
        },
        avatarUrl: {
            type: String,
            required: [true, "Please provide avatar Image"],
        },
    },
        { timestamps: true },
);

export default mongoose.model("Account", AccountSchema);
