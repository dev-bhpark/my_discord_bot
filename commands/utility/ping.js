const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	// cooldown: This is used for how long the user would have to wait before using the command again.
	//      this is use d for avoiding spams
	cooldown: 5,
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),

	// it is a part where the bot writes back to the user
	// async is for "asynchronous" where it will not hold the CPU and it interacts
	// when the CPU finishes its job and comes back to do it.
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
