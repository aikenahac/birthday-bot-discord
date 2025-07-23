import { db } from './open';

/**
 * Sets or updates the birthday notification channel for a server.
 * @param {string} serverId - The ID of the server.
 * @param {string} channelId - The ID of the channel where birthday notifications should be sent.
 */
export function setServerBirthdayChannel(serverId: string, channelId: string) {
  try {
    db.run(
      `INSERT OR REPLACE INTO ServerBirthdayChannels (server_id, channel_id) VALUES (?, ?)`,
      [serverId, channelId],
    );

    console.log(`Birthday channel set for server ${serverId}: ${channelId}`);
  } catch (error) {
    console.error('Error setting server birthday channel:', error);
    throw error;
  }
}

/**
 * Gets the birthday notification channel for a server.
 * @param {string} serverId - The ID of the server.
 * @returns {string | null} The channel ID or null if not set.
 */
export function getServerBirthdayChannel(serverId: string): string | null {
  try {
    const result = db.prepare(
      `SELECT channel_id FROM ServerBirthdayChannels WHERE server_id = ?`
    ).get(serverId) as { channel_id: string } | undefined;

    return result?.channel_id || null;
  } catch (error) {
    console.error('Error getting server birthday channel:', error);
    return null;
  }
}

/**
 * Gets all servers that have birthday channels configured.
 * @returns {Array<{server_id: string, channel_id: string}>} Array of server-channel pairs.
 */
export function getAllServerBirthdayChannels(): Array<{server_id: string, channel_id: string}> {
  try {
    const results = db.prepare(
      `SELECT server_id, channel_id FROM ServerBirthdayChannels`
    ).all() as Array<{server_id: string, channel_id: string}>;

    return results;
  } catch (error) {
    console.error('Error getting all server birthday channels:', error);
    return [];
  }
}
