import mongoose from "mongoose";
import chalk from "chalk";

// Use ONLY ONE clean URL
const connectionURL = "mongodb+srv://khalidisse:pRD08v5gXHnXkzGJ@cluster0.oani2cy.mongodb.net/Biler_Market?retryWrites=true&w=majority";

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