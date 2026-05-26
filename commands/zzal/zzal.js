const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const zzalData = require('./zzal.json');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('zzal')
		.setDescription('Send zzal that you want!')
		.addStringOption((option) =>
			option
				.setName('selected_zzal')
				.setDescription('Select zzal')
				.setAutocomplete(true)
				.setRequired(true),
		),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();

		const filtered = zzalData
			.filter((zzal) => zzal.name.toLowerCase().includes(focusedValue.toLowerCase()))
			.slice(0, 25);
		await interaction.respond(
			filtered.map((zzal) => ({
				name: zzal.name,
				value: zzal.id,
			})),
		);
	},

	async execute(interaction) {
		await interaction.deferReply();

		const imagePath = interaction.options.getString('selected_zzal');
		const foundImage = zzalData.find((choice) => choice.id === imagePath);

		if (foundImage) {
			const filePath = path.join(__dirname, foundImage.path);
			const file = new AttachmentBuilder(filePath);

			await interaction.editReply({ files: [file] });
		} else {
			await interaction.editReply({
				content: 'Cannot find image',
			});
		}
	},
};
