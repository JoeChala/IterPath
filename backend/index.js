import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js"
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/auth/", authRoutes);

await connectDB();
app.listen(port, () => {
  
  console.log(`Server started at http://localhost:${port}`);
});