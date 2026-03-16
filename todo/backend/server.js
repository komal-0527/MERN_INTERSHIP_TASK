import express from "express";
import morgan from "morgan";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/todo", todoRoutes);

const PORT = process.env.PORT || 8080;
app.listen(() => {
  console.log(`App is listening on port ${PORT}`.bgCyan);
});
