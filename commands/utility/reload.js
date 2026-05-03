// Reload the command so that when developing it, I don't have to type restart everything.

const { SlashCommandBuilder } = require('discord.js');

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
			.getString(command.data.name, true)
			.toLowerCase();
		const command = interaction.client.commands.get(commandName);
		if (!command) {
			return interaction.reply(
				`There is no command with name \`${commandName}\`!`,
			);
		}

		delete require.cache[require.resolve(`./${command.data.name}.js`)];

		try {
			const newCommand = require(`./${command.data.name}.js`);
			interaction.client.commands.set(newCommand.data.name, newCommand);
			await interaction.reply(
				`Command \`${newCommand.data.name}\` was reloaded!`,
			);
		} catch (error) {
			console.error(error);
			await interaction.reply(
				`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``,
			);
		}
	},
};
