import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { setServerBirthdayChannel } from '../database/server-birthday-channels';

export const data = new SlashCommandBuilder()
  .setName('set-birthday-channel')
  .setDescription('Set the channel where birthday notifications will be sent')
  .addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('The channel to send birthday notifications to')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction: ChatInputCommandInteraction) {
  const channel = interaction.options.getChannel('channel');

  if (!channel) {
    return interaction.reply({
      content: '❌ Please specify a valid channel!',
      flags: ['Ephemeral']
    });
  }

  if (!interaction.guild) {
    return interaction.reply({
      content: '❌ This command can only be used in a server!',
      flags: ['Ephemeral']
    });
  }

  try {
    setServerBirthdayChannel(interaction.guild.id, channel.id);
    
    console.log(`Birthday channel set for server ${interaction.guild.name} (${interaction.guild.id}): ${channel.name} (${channel.id}) by ${interaction.user.username}`);

    return interaction.reply({
      content: `✅ Birthday notifications will now be sent to ${channel.toString()}!`
    });
  } catch (error) {
    console.error('Error setting birthday channel:', error);
    return interaction.reply({
      content: '❌ An error occurred while setting the birthday channel. Please try again.',
      flags: ['Ephemeral']
    });
  }
}
