const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Get info about a user or a server!')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('user')
				.setDescription('Info about a user')
				.addUserOption((option) =>
					option.setName('target').setDescription('The user'),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('server')
				.setDescription('Info about the server'),
		),

	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === 'user') {
			// ??: Nullish Operator. It returns right operand when the left operand is null
			const user =
				interaction.options.getUser('target') ?? interaction.user;
			return await interaction.reply(
				`User name: ${user.username}\nID: ${user.id}`,
			);
		}
		if (subcommand === 'server') {
			if (!interaction.guild) {
				return await interaction.reply('Only be used in the server');
			}

			try {
				// 2. 멤버 정보를 가져옵니다.
				const members = interaction.guild.members.cache.first(5);
				const memberNames = members
					.map((m) => m.user.username)
					.join(', ');

				return await interaction.reply(
					`Server Name: ${interaction.guild.name}\nMember Number: ${interaction.guild.memberCount}\nMembers: ${memberNames}`,
				);
			} catch (error) {
				console.error(error);
				return await interaction.editReply(
					'멤버 정보를 가져오는 중 오류가 발생했습니다.',
				);
			}
		}
	},
};
