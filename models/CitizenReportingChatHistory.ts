import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["text", "image_url"],
      required: true,
    },
    text: {
      type: String,
    },
    image_url: {
      url: {
        type: String,
      },
    },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    content: {
      type: [contentSchema],
      required: true,
    },
  },
  { _id: false }
);

const chatHistorySchema = new mongoose.Schema(
  {
    userIP: {
      type: String,
      required: true,
    },
    messages: {
      type: [messageSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const CitizenReportingChatHistory =
  mongoose.models.ChatHistory ||
  mongoose.model("ChatHistory", chatHistorySchema);

export default CitizenReportingChatHistory;