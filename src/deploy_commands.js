const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

// const { clientId, guildId, token } = process.env;
const { clientId, token } = process.env;

// delcare an array of commands
const commands = [];

const foldersPath = path.join(__dirname, '../commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

/*

By uncommanting this code, it will delete a "Ping" command. The numbers are the
"Command ID", which can be drive from "Server settings" => "Integrations"

rest.delete(
	Routes.applicationGuildCommand(clientId, guildId, '1495497389476151486'),
)
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);
*/
/*
    ()(); => this is called the "Immediately Invoked Function Expression".
    The first () has a function. By using this we declare the function as an "Expression"
    The second (); means that "execute that function"
*/
// deploy the commands
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			// Routes.applicationGuildCommands(clientId, guildId),
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
