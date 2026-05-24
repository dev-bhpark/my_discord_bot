const { joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('join').setDescription('Join voice channel'),

	async execute(interaction) {
		const calledUser = interaction.member;

		if (!calledUser.voice.channel) {
			return await interaction.reply('No one is in the voice channel!');
		}

		const connection = joinVoiceChannel({
			channelId: calledUser.voice.channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		if (connection) {
			await interaction.reply('Bot joined successfully!');
		} else {
			await interaction.reply('Bot failed to join :(');
		}
	},
};
