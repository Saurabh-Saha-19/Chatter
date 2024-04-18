import mongoose from "mongoose";

const activeUserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});

const activeUserModel = mongoose.model("active-user", activeUserSchema);
export { activeUserModel };
