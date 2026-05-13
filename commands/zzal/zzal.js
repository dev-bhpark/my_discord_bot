const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const speakiData = require('./zzal.json');
const path = require('node:path');

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

		const filtered = speakiData
			.filter((zzal) =>
				zzal.name.toLowerCase().includes(focusedValue.toLowerCase()),
			)
			.slice(0, 25);
		await interaction.respond(
			filtered.map((zzal) => ({
				name: zzal.name,
				value: zzal.path,
			})),
		);
	},
	async execute(interaction) {
		const imagePath = interaction.options.getString('selected_zzal');

		try {
			const filePath = path.join(__dirname, imagePath);
			const file = new AttachmentBuilder(filePath);

			await interaction.reply({ files: [file] });
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'Error for finding a file.',
				ephemeral: true,
			});
		}
	},
};
