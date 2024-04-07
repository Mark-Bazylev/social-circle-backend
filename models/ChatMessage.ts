import mongoose, { Document, ObjectId } from "mongoose";

export interface ChatMessageDocument extends Document {
  createdBy: ObjectId;
  message: string;
  room: string;
}

const ChatMessageSchema = new mongoose.Schema<ChatMessageDocument>(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide user"],
      ref: "User",
    },
    message: {
      type: String,
      required: [true, "Please add text"],
      maxlength: 300,
    },
    room: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ChatMessageDocument>("ChatMessage", ChatMessageSchema);
