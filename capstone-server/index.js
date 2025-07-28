import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
        dbName: process.env.DB_NAME
})
  .then(() => console.log("Database Connected"))
  .catch((err) => {
    console.error("Database Connection Error", err);
    process.exit(1);
  });

//Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is Currently Running"))