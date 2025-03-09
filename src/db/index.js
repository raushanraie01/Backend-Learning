import mongoose from "mongoose";
import { DB_NAME } from "../constant";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(connectionInstance);
  } catch (error) {
    console.log("MongoDB connection eror ", error);
    // throw error;
    process.exit(1);
  }
};
