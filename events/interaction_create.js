/*
    Main gate keeper, when the user types the command this code will run.
    It first checks if there is a cooldown condition. If not then it will
    execute the command.
*/
const { Events, MessageFlags, Collection } = require('discord.js');

// module.exports: it is like a .h header file. It allows the JS to use the
// specific datas to the main file when it is calling it by using "require()" function.
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(
				interaction.commandName,
			);
			if (!command || !command.autocomplete) return;
			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
			return;
		}
		if (!interaction.isChatInputCommand()) {
			return;
		}
		const command = interaction.client.commands.get(
			interaction.commandName,
		);

		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`,
			);
			return;
		}

		// check for cooldowns
		const { cooldowns } = interaction.client;

		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		// now: current timestamp
		const now = Date.now();

		// timestamps: reference to the collection of user ids and timestamp key/value pairs for the triggered command
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3;
		// cooldownAmount: specified cooldown for the command, converted to milliseconds for straightforward calculation.
		const cooldownAmount =
			(command.cooldown ?? defaultCooldownDuration) * 1_000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime =
				timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1_000);
				return interaction.reply({
					content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
					flags: MessageFlags.Ephemeral,
				});
			}
		}
		timestamps.set(interaction.user.id, now);
		setTimeout(
			() => timestamps.delete(interaction.user.id),
			cooldownAmount,
		);

		// if there is no cooldowns execute the command
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	},
};
