// server.js
import express from "express";
import cors from "cors";
import chalk from "chalk";
import connectDB from "./db/mongoose.js";

import productsRouter from "./routes/productsRouter.js";
import userRouter from "./routes/usersRouter.js";
import loanRouter from "./routes/loanRouter.js";

const app = express(); // ✅ FIRST create app
const port = process.env.PORT || 5000;

// ✅ CORS (put BEFORE routes)
app.use(
  cors({
    origin: "*", // for testing
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// ✅ Handle preflight (important for your error)
app.options("*", cors());

// ✅ Body parser
app.use(express.json());

// ✅ Routes
app.use(userRouter);
app.use(productsRouter);
app.use(loanRouter);

// ✅ Connect DB
connectDB();

// ✅ Start server
app.listen(port, () => {
  console.log(chalk.bold.green.bgWhite("Server UP Running on port " + port));
});
