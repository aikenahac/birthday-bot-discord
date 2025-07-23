const { DISCORD_CLIENT_ID, DISCORD_TOKEN } = process.env;

if (!DISCORD_CLIENT_ID || !DISCORD_TOKEN) {
  throw new Error('Missing environment variables');
}

export const config = {
  DISCORD_CLIENT_ID,
  DISCORD_TOKEN,
};
