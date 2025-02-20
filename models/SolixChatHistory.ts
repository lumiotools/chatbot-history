import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema(
  {
    userIP: {
      type: String,
      required: true,
    },
    messages: [
      {
        role: String,
        content: String,
        sources: [
          {
            page: Number,
            snippet: String,
            _id: false,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SolixChatHistory =
  mongoose.models.ChatHistory ||
  mongoose.model("ChatHistory", chatHistorySchema);

export default SolixChatHistory;
