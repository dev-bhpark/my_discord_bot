// fs: Node's native file system module
// it is used to read the 'command' directory and identify our command files
const fs = require('node:fs');

// path: native path utility module
// it helps us to construct paths to access files and directories.
const path = require('node:path');

// require(): getting something from the library at runtime

// From discord.js it will grab Client, Events, and GatewayIntentBits
const { Client, GatewayIntentBits, Collection } = require('discord.js');

// .config() gets the .env file as a object
// process: Default object that Node.js creates
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const token = process.env.token;

/*
    new Client: it is creating a new instance
    {}: it is an object. JS sends the arguments as an object using {}
        inside the {} it's the settings of the bot
 */
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Collection class: extends JS native Map class.
client.commands = new Collection();

// path.join(): construct the path to commands
// foldersPath = /discord_bot/commands
// __dirname: special variable that provide directory name and file name of the current module.
const foldersPath = path.join(__dirname, '../commands');

// fs.readdirSync(): reads the path to the directory and returns an array of absolute path.
const commandFolders = fs.readdirSync(foldersPath);

// from "commands" folder it will find the folders. So starting from "utility"
// folder = utility
for (const folder of commandFolders) {
	// From that folder recreate a path
	// commandsPath = /discord_bot/commands/utility
	const commandsPath = path.join(foldersPath, folder);

	// Now with that directory read all the files that ends with '.js'
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));

	// from that files select one of the file
	// file = ping.js
	for (const file of commandFiles) {
		// From the previous commandsPath create a new path with the file
		// filePath = /discord_bot/commands/utility/ping.js
		const filePath = path.join(commandsPath, file);

		// Now call that as a library where we can call the functions and variables
		const command = require(filePath);

		// if there are 'data' and 'execute'
		if ('data' in command && 'execute' in command) {

			// set command.category as folder so that I can use it for "realod.js"
			command.category = folder;
			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

/*
    () =>: This is called an Arrow Function.
    In JS there is a function called "Anonymous Function", which acts as a function
    but it is not declared and doesn't have a name.
    () => is being used and it is passing an argument called "readyClient",
    and that arugment is being used inside the console.log
*/
// Event handler
const eventsPath = path.join(__dirname, '../events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

/*
    ...args: This is called the "Rest Parameters".
        Here the anonymous function gets all the arguments as an array and
        executes it in "event.execute()" function.

    .once(): This is an "Event Table". Like C's signal, when the user logs in
        the function executes. So after the loging the ...args receives the values
        of "client".
*/
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(token);

client.cooldowns = new Collection();

