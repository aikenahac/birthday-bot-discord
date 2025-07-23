import { db } from "./open";

export function initializeDatabase() {
  const createUserBirthdaysTableQuery = `
    CREATE TABLE IF NOT EXISTS UserBirthdays (
      user_id TEXT NOT NULL,
      server_id TEXT NOT NULL,
      birthday TEXT NOT NULL,
      PRIMARY KEY (user_id, server_id)
    )
  `;
  
  const createServerBirthdayChannelsTableQuery = `
    CREATE TABLE IF NOT EXISTS ServerBirthdayChannels (
      server_id TEXT PRIMARY KEY UNIQUE,
      channel_id TEXT NOT NULL
    )
  `;
  
  db.exec(createUserBirthdaysTableQuery);
  db.exec(createServerBirthdayChannelsTableQuery);
}