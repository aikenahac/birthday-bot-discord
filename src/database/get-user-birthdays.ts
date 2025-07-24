import { db } from './open';

interface UserBirthdayRow {
  user_id: string;
  server_id: string;
  birthday: string;
}

/**
 * Retrieves a list of users birthdays within the specified number of days.
 * @param days The number of days from today to look ahead for birthdays
 * @param serverId The server ID to filter birthdays for (optional)
 * @returns {Array<UserBirthdayRow>} Array of users with birthdays in the specified range
 */

export function getUserBirthdays(days: number, serverId?: string): Array<UserBirthdayRow> {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    console.log(`Fetching birthdays for the next ${days} days${serverId ? ` for server ${serverId}` : ''}`);
    
    // Get all birthdays and filter them in JavaScript for more precise date handling
    let query = `SELECT user_id, server_id, birthday FROM UserBirthdays`;
    let params: string[] = [];
    
    if (serverId) {
      query += ` WHERE server_id = ?`;
      params.push(serverId);
    }
    
    const allRows = db.prepare(query).all(...params) as UserBirthdayRow[];
    
    const validBirthdays = allRows.filter(row => {
      // Extract month and day from stored birthday (YYYY-MM-DD)
      const dateParts = row.birthday.split('-');
      if (dateParts.length !== 3) return false;
      
      const month = parseInt(dateParts[1]!);
      const day = parseInt(dateParts[2]!);
      
      if (isNaN(month) || isNaN(day)) return false;
      
      // Create birthday date for current year
      let birthdayThisYear = new Date(currentYear, month - 1, day);
      
      // If birthday already passed this year, check next year's birthday
      if (birthdayThisYear < today) {
        birthdayThisYear = new Date(currentYear + 1, month - 1, day);
      }
      
      // Check if birthday falls within the specified number of days
      const diffTime = birthdayThisYear.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays >= 0 && diffDays <= days;
    });

    console.log(validBirthdays);

    return validBirthdays;
  } catch (error) {
    console.error('Error retrieving user birthdays:', error);
  }

  return [];
}
