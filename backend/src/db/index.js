import mongoose from "mongoose";
import { DB_NAME } from "../constent.js";

const connectDB = async () => {
  try {
    const instens = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`mongodb connected successfully on ${instens.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection FAILED", error);
    process.exit(1);
  }
};

export default connectDB;
