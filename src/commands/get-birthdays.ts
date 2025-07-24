import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import { getUserBirthdays } from '../database/get-user-birthdays';
import { format, parseISO } from 'date-fns';

export const data = new SlashCommandBuilder()
  .setName('get-birthdays')
  .setDescription('Get upcoming birthdays within a specified number of days')
  .addIntegerOption((option) =>
    option
      .setName('days-from-today')
      .setDescription(
        'Number of days from today to check for birthdays (default: 31)',
      )
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(365),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const days = interaction.options.getInteger('days-from-today') ?? 31;

  if (!interaction.guild) {
    return interaction.reply({
      content: "❌ This command can only be used in a server!",
      flags: ["Ephemeral"]
    });
  }

  try {
    const birthdays = getUserBirthdays(days, interaction.guild.id);

    if (birthdays.length === 0) {
      return interaction.reply({
        content: `🎂 No birthdays found in the next ${days} day${
          days === 1 ? '' : 's'
        }!`,
        flags: [
        "Ephemeral"
      ]
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🎉 Upcoming Birthdays')
      .setColor(0x00ae86)
      .setDescription(
        `Birthdays in the next ${days} day${days === 1 ? '' : 's'}:`,
      )
      .setTimestamp();

    let birthdayList = '';
    for (const birthday of birthdays) {
      const currentYear = (new Date()).getFullYear();
      const date = parseISO(birthday.birthday);
      const formattedDate = format(date, 'MMMM d');
      const newAge = currentYear - date.getFullYear();
      birthdayList += `🎂 <@${birthday.user_id}> - ${formattedDate} (${newAge})\n`;
    }

    embed.addFields({
      name: `Found ${birthdays.length} birthday${
        birthdays.length === 1 ? '' : 's'
      }`,
      value: birthdayList || 'No birthdays in this range.',
      inline: false,
    });

    return interaction.reply({
      embeds: [embed],
    });
  } catch (error) {
    console.error('Error fetching birthdays:', error);
    return interaction.reply({
      content:
        '❌ An error occurred while fetching birthdays. Please try again.',
      flags: [
        "Ephemeral"
      ]
    });
  }
}
