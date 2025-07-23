import { Database } from "bun:sqlite";

export const db = new Database("user_birthdays.db", {
  create: true
});