import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const baseUrl = process.env.MONGODB || "0.0.0.0:27017";

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(`mongodb://${baseUrl}/chatter`);
    console.log("MongoDB Connected using mongoose");
  } catch (err) {
    console.log(err);
  }
};
