import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { getTodaysBirthdays } from '../database/get-todays-birthdays';
import { getAllServerBirthdayChannels } from '../database/server-birthday-channels';

/**
 * Checks for today's birthdays and sends notifications to configured channels.
 * @param {Client} client - The Discord client instance.
 */
export async function checkAndSendBirthdayNotifications(client: Client) {
  try {
    console.log('Running daily birthday check...');
    
    const serverChannels = getAllServerBirthdayChannels();
    
    if (serverChannels.length === 0) {
      console.log('No servers have configured birthday channels');
      return;
    }

    for (const { server_id, channel_id } of serverChannels) {
      try {
        const guild = client.guilds.resolve(server_id);
        if (!guild) {
          console.log(`Guild ${server_id} not found or bot not in guild`);
          continue;
        }

        const channel = guild.channels.cache.get(channel_id) as TextChannel;
        if (!channel || !channel.isTextBased()) {
          console.log(`Channel ${channel_id} not found or not text-based in guild ${server_id}`);
          continue;
        }

        // Get birthdays for this specific server
        const todaysBirthdays = getTodaysBirthdays(server_id);
        
        if (todaysBirthdays.length === 0) {
          console.log(`No birthdays today for server ${guild.name}`);
          continue;
        }

        // Filter birthdays for users who are actually in this guild
        const members = await guild.members.fetch({ force: true });
        const guildBirthdays = todaysBirthdays.filter(birthday => {
          return members.has(birthday.user_id);
        });

        if (guildBirthdays.length === 0) {
          console.log(`No birthdays today for members in guild ${guild.name}`);
          continue;
        }

        // Create birthday notification embed
        const embed = new EmbedBuilder()
          .setTitle('🎉 Birthday Celebration! 🎂')
          .setColor(0xff69b4)
          .setTimestamp();

        let birthdayList = '';
        for (const birthday of guildBirthdays) {
          const member = guild.members.cache.get(birthday.user_id);
          if (member) {
            // Calculate age if we can
            const birthYear = parseInt(birthday.birthday.split('-')[0]!);
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;
            
            birthdayList += `🎂 ${member.toString()} is turning ${age} today!\n`;
          }
        }

        embed.addFields({
          name: `Happy Birthday! 🎈`,
          value: birthdayList,
          inline: false,
        });

        embed.setFooter({
          text: '🎉 Wishing you all the best on your special day! 🎉'
        });

        await channel.send({ embeds: [embed] });
        console.log(`Birthday notification sent to ${channel.name} in ${guild.name}`);
        
      } catch (error) {
        console.error(`Error sending birthday notification to guild ${server_id}:`, error);
      }
    }
    
  } catch (error) {
    console.error('Error in birthday notification check:', error);
  }
}
