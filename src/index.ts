import { Client } from "discord.js";
import cron from "node-cron";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { initializeDatabase } from "./database/init";
import { checkAndSendBirthdayNotifications } from "./services/birthday-notifications";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

client.once("ready", async () => {
  console.log("Discord bot is ready! 🤖");
  
  initializeDatabase();
  
  // Run initial birthday check
  await checkAndSendBirthdayNotifications(client);
  
  // Schedule daily birthday check at 8 AM Slovenia time (Europe/Ljubljana timezone)
  cron.schedule('0 8 * * *', async () => {
    console.log('Running scheduled birthday check at 8 AM Slovenia time');
    await checkAndSendBirthdayNotifications(client);
  }, {
    timezone: "Europe/Ljubljana"
  });
  
  console.log("Birthday notification cron job started - checking daily at 8 AM Slovenia time");
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);