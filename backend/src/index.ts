import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
import authRoutes from "./routes/auth";
import diaryRoutes from "./routes/diary";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import process from "node:process";
import * as schema from "./db/schema.js";

dotenv.config();

const pool = new pkg.Pool({ 
  connectionString: process.env.DATABASE_URL,
});
const app = express();
const PORT = process.env.PORT || 5000;

export const db = drizzle(pool, { schema });

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes as any);
app.use("/api/diary", diaryRoutes as any);


app.get("/", (req, res) => {
  res.send("Сервер Эмоционального Дневника запущен и готов к работе!");
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер успешно запущен на http://localhost:${PORT}`);
});

