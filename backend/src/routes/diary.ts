import { Router, RequestHandler } from "express";
import { db } from "../index.js";
import { diaryEntries } from "../db/schema.js";
import { authMiddleware } from "./auth.js"; 
import { eq, and } from "drizzle-orm";

const router = Router();

router.use(authMiddleware);

const saveHandler: RequestHandler = async (req, res) => {
  try {
    const { date, mood, rows } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ error: "Пользователь не авторизован" });
      return;
    }
    if (!date || !rows) {
      res.status(400).json({ error: "Не переданы дата или строки таблицы" });
      return;
    }

    const existingEntries = await db
      .select()
      .from(diaryEntries)
      .where(and(eq(diaryEntries.userId, userId), eq(diaryEntries.date, date)))
      .limit(1);

    if (existingEntries[0]) {
      await db
        .update(diaryEntries)
        .set({ mood, rows })
        .where(and(eq(diaryEntries.userId, userId), eq(diaryEntries.date, date)));
    } else {
      await db.insert(diaryEntries).values({ userId, date, mood, rows });
    }
    res.json({ message: "Запись успешно сохранена в базу данных!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при сохранении записи" });
  }
};

const getByDateHandler: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;

    const date = req.params.date as string; 

    if (!userId) {
      res.status(401).json({ error: "Пользователь не авторизован" });
      return;
    }

    const entry = await db
      .select()
      .from(diaryEntries)
      .where(and(eq(diaryEntries.userId, userId), eq(diaryEntries.date, date)))
      .limit(1);

    if (!entry[0]) {
      res.json({ date, mood: null, rows: [] });
      return;
    }

    res.json(entry[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении записи за указанную дату" });
  }
};

const getAllHandler: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Пользователь не авторизован" });
      return;
    }
    const userEntries = await db.select().from(diaryEntries).where(eq(diaryEntries.userId, userId));
    res.json(userEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении архива записей" });
  }
};

router.post("/save", saveHandler);
router.get("/date/:date", getByDateHandler);
router.get("/all", getAllHandler);

export default router;