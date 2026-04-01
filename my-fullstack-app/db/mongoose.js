import mongoose from "mongoose";
import chalk from "chalk";

// Use ONLY ONE clean URL
const connectionURL =
  "mongodb+srv://khalidpower:zICsvOiFu9Ut3y1g@cluster0.wr7epe1.mongodb.net/Biller-market?appName=Cluster0";

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