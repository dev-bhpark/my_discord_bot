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
			.filter((choice) => choice.name.toLowerCase().includes(focusedValue.toLowerCase()))
			.slice(0, 25);
		await interaction.respond(
			filtered.map((choice) => ({
				name: choice.name,
				value: choice.id,
			})),
		);
	},

	async execute(interaction) {
		// add this so that discord bot can find gif more than 3 seconds
		await interaction.deferReply();

		const gifURL = interaction.options.getString('category');

		const foundGif = gifData.find((choice) => choice.id === gifURL);

		if (foundGif) {
			await interaction.editReply(foundGif.url);
		} else {
			await interaction.editReply({
				content: 'Cannot find GIF',
			});
		}
	},
};
