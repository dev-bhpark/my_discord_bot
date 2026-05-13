// Reload the command so that when developing it, I don't have to type restart everything.

const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		// creating an option. This will show up when the user types '/reload' creating a 'command' box and make them to type in the command
		.addStringOption((option) =>
			option
				.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true),
		),

	async execute(interaction) {
		// ---------- Need to resolve the file path for reload command --------
		const commandName = interaction.options
			.getString('command', true)
			.toLowerCase();
		const command = interaction.client.commands.get(commandName);
		if (!command) {
			return interaction.reply(
				`There is no command with name \`${commandName}\`!`,
			);
		}

		const filePath = path.join(
			__dirname,
			`../${command.category}/${command.data.name}.js`,
		);
		console.log(filePath);
		require.cache[require.resolve(filePath)];

		// if (require.cache[require.resolve(filePath)]) {
		// 	delete require.cache[require.resolve(filePath)];
		// 	console.log(`✅ Cache deleted for: ${commandName}`);
		// } else {
		// 	console.log(
		// 		`❌ No cache found for: ${commandName}. Path might be wrong.`,
		// 	);
		// }
		try {
			const newCommand = require(filePath);

			newCommand.category = command.category;

			interaction.client.commands.set(newCommand.data.name, newCommand);

			await interaction.reply(
				`Command \`${newCommand.data.name}\` was reloaded!`,
			);
		} catch (error) {
			console.error(error);
			await interaction.reply(
				`RealodFile: There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``,
			);
		}
	},
};
