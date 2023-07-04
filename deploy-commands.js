const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];

const commandsPath = path.join(__dirname, "src/commands");
const commandFolders = fs.readdirSync(commandsPath);

for (const commandFolder of commandFolders) {
    const commandsPath1 = path.join(commandsPath, commandFolder);
    const commandFiles = fs.readdirSync(commandsPath1).filter(
        (file) => file.endsWith(".js"),
    );

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath1, file);
        const command = require(filePath);
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
