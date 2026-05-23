// Reload the command so that when developing it, I don't have to type restart everything.

const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		// make this command useable only for admission
		.setDefaultMemberPermissions('0')
		// creating an option. This will show up when the user types '/reload' creating a 'command' box and make them to type in the command
		.addStringOption((option) =>
			option.setName('command').setDescription('The command to reload.').setRequired(true),
		),

	async execute(interaction) {
		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply({
				content: `There is no command with name \`${commandName}\`!`,
				flags: MessageFlags.Ephemeral,
			});
		}

		const category = command.category ? `${command.category}/` : '';
		const filePath = path.join(__dirname, `../${category}${command.data.name}.js`);

		console.log(`[Reload] Attempting to reload path: ${filePath}`);

		try {
			// require.resolve use absolute file path for cache key
			const resolvedPath = require.resolve(filePath);

			if (require.cache[resolvedPath]) {
				// if found delete the cache
				delete require.cache[resolvedPath];
				console.log(`✅ Cache deleted for: ${commandName}`);
			}

			// after the cache is deleted get the file path
			const newCommand = require(filePath);

			// maintain the original category
			if (command.category) {
				newCommand.category = command.category;
			}

			// Reset the new command to the client collection
			interaction.client.commands.set(newCommand.data.name, newCommand);

			await interaction.reply({
				content: `Command \`${newCommand.data.name}\` was successfully reloaded!`,
				flags: MessageFlags.Ephemeral,
			});
		} catch (error) {
			console.error(error);

			const errorMessage = `ReloadFile Error for \`${commandName}\`:\n\`${error.message}\``;
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: errorMessage,
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({ content: errorMessage, flags: MessageFlags.Ephemeral });
			}
		}
	},
};
