import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

// Use ONLY ONE clean URL
const connectionURL = process.env.MONGO_URI;

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(connectionURL);
    console.log(chalk.green.bold("Connected to MongoDB"));
  } catch (error) {
    console.log(chalk.red.bold("Failed to connect to MongoDB"));
    console.error(error); // ✅ print the real error
  }
};

export default connectDB;
