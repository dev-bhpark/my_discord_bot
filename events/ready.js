const { Events } = require('discord.js');

// name: => states which event this file is fore
// once: => holds a boolean value that specifies if that event should run only once.
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
