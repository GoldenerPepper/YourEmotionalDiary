import { pgTable, serial, varchar, text, jsonb, integer, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
});

export interface DiaryRow {
  action: string;
  emotions: string;
  bodyReaction: string;
  result: string;
}

export const diaryEntries = pgTable("diary_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  mood: varchar("mood", { length: 20 }), 
  rows: jsonb("rows").$type<DiaryRow[]>().notNull(),
}, (table) => {
  return {
    userDateUnique: unique().on(table.userId, table.date),
  };
});