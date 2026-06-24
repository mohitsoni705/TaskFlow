import express from "express";
import cors from "cors";
import  {connectDb} from "./config/db.ts";
import { signUp } from "./controllers/auth.controller.ts";
import authRoutes from "./routes/auth.routes.ts";
import boardRoutes from "./routes/boards.routes.ts"
import taskRoutes from "./routes/boards.routes.ts";
import dotenv from "dotenv";
const app = express();

app.use(cors());
app.use(express.json());
connectDb();
dotenv.config();
// app.use("/api/v1/auth",loginUser);
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1",boardRoutes);
app.use("/api/v1",taskRoutes);
export default app;