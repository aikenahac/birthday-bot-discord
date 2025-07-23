import { db } from './open';

/**
 * Creates or updates a user's birthday in the database.
 * @param {string} userId - The ID of the user.
 * @param {string} birthday - The birthday of the user in YYYY-MM-DD format.
 */
export function createUserBirthday(userId: string, birthday: string) {
  try {
    db.run(
      `INSERT OR REPLACE INTO UserBirthdays (user_id, birthday) VALUES (?, ?)`,
      [userId, birthday],
    );

    console.log(`Birthday saved for user ${userId}: ${birthday}`);
  } catch (error) {
    console.error('Error creating user birthday:', error);
    throw error;
  }
}
