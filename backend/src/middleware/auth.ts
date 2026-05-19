import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import process from "node:process"; 

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Доступ запрещен. Отсутствует токен." });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Токен не найден." });
    return;
  }

  try {
    const secretKey: string = process.env.JWT_SECRET || "super_secret_key_for_diary_123";

    const decoded = jwt.verify(token, secretKey) as { userId: number };
    
    (req as any).userId = decoded.userId; 
    next(); 
  } catch (error) {
    res.status(401).json({ error: "Невалидный или просроченный токен" });
    return;
  }
};