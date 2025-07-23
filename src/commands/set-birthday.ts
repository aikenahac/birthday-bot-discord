import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { createUserBirthday } from "../database/create-user-birthday";

export const data = new SlashCommandBuilder()
  .setName("set-birthday")
  .setDescription("Set a birthday for a user")
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("The user to set the birthday for")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("date")
      .setDescription("Birthday date in DD.MM.YYYY format (e.g., 18.12.2004)")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser("user");
  const dateInput = interaction.options.getString("date");

  if (!user || !dateInput) {
    return interaction.reply({
      content: "Both user and date are required!",
      flags: [
        "Ephemeral"
      ]
    });
  }

  if (!interaction.guild) {
    return interaction.reply({
      content: "❌ This command can only be used in a server!",
      flags: ["Ephemeral"]
    });
  }

  // Validate date format (DD.MM.YYYY)
  const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const match = dateInput.match(dateRegex);

  if (!match) {
    return interaction.reply({
      content: "Invalid date format! Please use DD.MM.YYYY format (e.g., 18.12.2003)",
      flags: [
        "Ephemeral"
      ]
    });
  }

  const [, day, month, year] = match;
  const dayNum = parseInt(day!);
  const monthNum = parseInt(month!);
  const yearNum = parseInt(year!);

  if (yearNum < 1900) {
    return interaction.reply({
      content: "Nuh uh",
      flags: [
        "Ephemeral"
      ]
    });
  }

  // Basic date validation
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
    return interaction.reply({
      content: "Invalid date! Please check the day, month, and year values.",
      flags: [
        "Ephemeral"
      ]
    });
  }

  const birthday = `${yearNum.toString().padStart(4, '0')}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;

  try {
    createUserBirthday(user.id, interaction.guild.id, birthday);
    
    console.log(`Birthday set for user ${user.username} in server ${interaction.guild.name}: ${birthday} [${interaction.member?.user.username}]`);

    return interaction.reply({
      content: `✅ Birthday set for ${user.toString()}: ${dateInput}`
    });
  } catch (error) {
    console.error("Error setting birthday:", error);
    return interaction.reply({
      content: "❌ An error occurred while setting the birthday. Please try again.",
      ephemeral: true
    });
  }
}