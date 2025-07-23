import { db } from "./open";

export function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS UserBirthdays (
      user_id TEXT PRIMARY KEY UNIQUE,
      birthday TEXT NOT NULL
    )
  `;
  
  db.exec(createTableQuery);
}