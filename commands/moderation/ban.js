const {
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Select a member and ban them.')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('The member to ban')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option.setName('reason').setDescription('The reason for banning'),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		// get the user from 'target'
		const target = interaction.options.getUers('target');

		// get the reason from 'reason' if not set it as "No reason provided"
		const reason =
			interaction.options.getString('reason') ?? 'No reason provided';

		await interaction.reply(
			`Banning ${target.username} for reason: ${reason}`,
		);
		await interaction.guild.members.ban(target);
	},
};
