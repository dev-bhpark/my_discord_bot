const { SlashCommandBuilder } = require('discord.js');
const gifData = require('./gifs.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gif')
		.setDescription('Sends a gif that you want!')
		.addStringOption((option) =>
			option
				.setName('category')
				.setDescription('The gif category')
				.setAutocomplete(true)
				.setRequired(true),
		),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();

		const filtered = gifData
			.filter((choice) =>
				choice.name.toLowerCase().includes(focusedValue.toLowerCase()),
			)
			.slice(0, 25);
		await interaction.respond(
			filtered.map((choice) => ({
				name: choice.name,
				value: choice.value,
			})),
		);
	},

	async execute(interaction) {
		const gifURL = interaction.options.getString('category');

		if (gifURL) {
			await interaction.reply(gifURL);
		} else {
			await interaction.reply({
				content: 'Cannot find GIF',
				ephemeral: true,
			});
		}
	},
};
