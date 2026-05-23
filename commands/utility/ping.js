const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	// cooldown: This is used for how long the user would have to wait before using the command again.
	//      this is use d for avoiding spams
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.setDefaultMemberPermissions('0'),

	// it is a part where the bot writes back to the user
	// async is for "asynchronous" where it will not hold the CPU and it interacts
	// when the CPU finishes its job and comes back to do it.
	async execute(interaction) {
		/*
			using deferReply(); for resolving interaction that requires more than three seconds
			await interaction.deferReply();
			// you can do things that take time here (database queries) that you need for the initial response
			// you can take up to 15 minutes, then the interaction token becomes invalid!
			await interaction.editReply('Pong!');
		*/

		/*
			// 'reply' is used for sending a response.
			// await interaction.reply('Pong!');
		*/

		/*
			// followUp is used for sending additional messages
			await interaction.reply('Pong!');
			await interaction.followUp('Pong again!');

			// It can also be used with ephemeral response
			await interaction.followUp({ content: 'Pong again!', flags: MessageFlags.Ephemeral });
		*/

		// creating "Ephemeral(lasting short period of time) responses"
		// This message is only showed to me so it is useful to make changes and debug
		await interaction.reply({ content: 'Secret Pong!', flags: MessageFlags.Ephemeral });

		// setTimeout() will make the await interaction.deleteReply() to be activated in a specific time
		// deleteReply() deletes the reply
		setTimeout(async () => {
			await interaction.deleteReply();
		}, 5000);
	},
};
