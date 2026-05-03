const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Replies with your input!')
		.addStringOption((option) =>
			option
				.setName('input')
				.setDescription('The input to echo back')
				.setRequired(true)
				.setMaxLength(2_000),
		)
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('The channel to echo into')
				.addChannelTypes(ChannelType.GuildText),
		),
	async execute(interaction) {
		const input = interaction.options.getString('input');
		const channel = interaction.options.getChannel('channel');

		if (channel) {
			await channel.send(input);
			return interaction.reply({
				content: `Sent a message to ${channel}!`,
				ephemeral: true,
			});
		}
		await interaction.reply(input);
	},
};
