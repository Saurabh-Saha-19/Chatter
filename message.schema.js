import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const messageModel = mongoose.model("message", messageSchema);
export { messageModel };
