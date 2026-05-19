import { Router, RequestHandler } from "express";
import { db } from "../index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import process from "node:process";

const router = Router();

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

const registerHandler: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Заполните все поля" });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const existingUsers = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
    if (existingUsers[0]) {
      res.status(400).json({ error: "Пользователь с таким email уже зарегистрирован" });
      return;
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const insertedUser = await db.insert(users).values({ email: cleanEmail, password: hashedPassword }).returning();

    const newUser = insertedUser[0] as any;

    if (!newUser) {
      res.status(500).json({ error: "Не удалось получить данные созданного пользователя" });
      return;
    }

    const secretKey: string = process.env.JWT_SECRET || "super_secret_key_for_diary_123";

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      secretKey,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, message: "Регистрация успешна!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера при регистрации" });
  }
};

const loginHandler: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Заполните все поля" });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const userList = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
    const user = userList[0] as any;

    if (!user) {
      res.status(400).json({ error: "Неверный email или пароль" });
      return;
    }

    const cleanDbPassword = String(user.password).trim();
    const isMatch = await bcrypt.compare(String(password), cleanDbPassword);

    if (!isMatch) {
      res.status(400).json({ error: "Неверный email или пароль" });
      return;
    }

    const secretKey: string = process.env.JWT_SECRET || "super_secret_key_for_diary_123";

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secretKey,
      { expiresIn: "7d" }
    );
    res.json({ token, message: "Вход успешен!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера при входе" });
  }
};

router.post("/register", registerHandler);
router.post("/login", loginHandler);

export default router;