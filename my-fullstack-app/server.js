// server.js
import express from "express";
import cors from 'cors'
import chalk from "chalk";
import connectDB from "./db/mongoose.js";
import "./db/mongoose.js"
import productsRouter from './routes/productsRouter.js'

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())

app.use(express.json());
app.use(productsRouter)


// Connect to DB and start server
connectDB();

app.listen(port, () => {
  console.log(chalk.bold.green.bgWhite("Server UP Running on port " + port));
});