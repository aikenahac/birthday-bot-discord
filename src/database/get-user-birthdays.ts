import { db } from './open';

interface UserBirthdayRow {
  user_id: string;
  birthday: string;
}

/**
 * Retrieves a list of users birthdays within the specified number of days.
 * @param days The number of days from today to look ahead for birthdays
 * @returns {Array<UserBirthdayRow>} Array of users with birthdays in the specified range
 */

export function getUserBirthdays(days: number): Array<UserBirthdayRow> {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    console.log(`Fetching birthdays for the next ${days} days`);
    
    // Get all birthdays and filter them in JavaScript for more precise date handling
    const allRows = db.prepare(`SELECT user_id, birthday FROM UserBirthdays`).all() as UserBirthdayRow[];
    
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
