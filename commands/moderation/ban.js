// const { CommandInteractionOptionResolver } = require('discord.js');
const {
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
	MessageFlags,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Select a member and ban them.')
		.addUserOption((option) =>
			option.setName('target').setDescription('The member to ban').setRequired(true),
		)
		.addStringOption((option) =>
			option.setName('reason').setDescription('The reason for banning'),
		)
		// allow other allowed member to ban user
		// allowed to give a user multiple permissions by merging them with '|' operator.
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		// allow this code to use it only inside the server.
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		// get the user from 'target'
		const target = interaction.options.getUser('target');
		if (!target) {
			return interaction.reply({
				content: 'cannot find user',
				flags: MessageFlags.Ephemeral,
			});
		}

		// get the reason from 'reason' if not set it as "No reason provided"
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

		await interaction.reply(`Banning ${target.username} for reason: ${reason}`);
		await interaction.guild.members.ban(target);
	},
};
