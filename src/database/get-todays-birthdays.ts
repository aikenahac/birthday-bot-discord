import { db } from './open';

interface UserBirthdayRow {
  user_id: string;
  server_id: string;
  birthday: string;
}

/**
 * Retrieves users who have birthdays today.
 * @param serverId The server ID to filter birthdays for (optional)
 * @returns {Array<UserBirthdayRow>} Array of users with birthdays today
 */
export function getTodaysBirthdays(serverId?: string): Array<UserBirthdayRow> {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
    const currentDay = today.getDate();
    
    console.log(`Checking for birthdays on ${currentMonth}/${currentDay}${serverId ? ` for server ${serverId}` : ''}`);
    
    // Get all birthdays and filter them in JavaScript for precise date handling
    let query = `SELECT user_id, server_id, birthday FROM UserBirthdays`;
    let params: string[] = [];
    
    if (serverId) {
      query += ` WHERE server_id = ?`;
      params.push(serverId);
    }
    
    const allRows = db.prepare(query).all(...params) as UserBirthdayRow[];
    
    const todaysBirthdays = allRows.filter(row => {
      // Extract month and day from stored birthday (YYYY-MM-DD)
      const dateParts = row.birthday.split('-');
      if (dateParts.length !== 3) return false;
      
      const month = parseInt(dateParts[1]!);
      const day = parseInt(dateParts[2]!);
      
      if (isNaN(month) || isNaN(day)) return false;
      
      // Check if month and day match today
      return month === currentMonth && day === currentDay;
    });

    console.log(`Found ${todaysBirthdays.length} birthdays today`);
    return todaysBirthdays;
  } catch (error) {
    console.error('Error retrieving today\'s birthdays:', error);
    return [];
  }
}
