import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { initializeDatabase } from "./database/init";
import { checkAndSendBirthdayNotifications } from "./services/birthday-notifications";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

// Birthday check interval (24 hours in milliseconds)
const BIRTHDAY_CHECK_INTERVAL = 24 * 60 * 60 * 1000;

client.once("ready", async () => {
  console.log("Discord bot is ready! 🤖");
  
  initializeDatabase();
  
  // Run initial birthday check
  await checkAndSendBirthdayNotifications(client);
  
  // Set up daily birthday check
  setInterval(async () => {
    await checkAndSendBirthdayNotifications(client);
  }, BIRTHDAY_CHECK_INTERVAL);
  
  console.log("Birthday notification cron job started - checking daily");
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