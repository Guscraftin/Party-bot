const dotenv = require("dotenv");
dotenv.config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
    ],
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();


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
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}


const eventsPath = path.join(__dirname, "src/events");
const eventFolders = fs.readdirSync(eventsPath);

for (const eventFolder of eventFolders) {
    const eventPath = path.join(eventsPath, eventFolder);
    const eventFiles = fs.readdirSync(eventPath).filter(
        (file) => file.endsWith(".js"),
    );

    for (const file of eventFiles) {
        const filePath = path.join(eventPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}


const buttonsPath = path.join(__dirname, "src/buttons");
const buttonsFolders = fs.readdirSync(buttonsPath);

for (const buttonsFolder of buttonsFolders) {
    const buttonsPath1 = path.join(buttonsPath, buttonsFolder);
    const buttonFiles = fs.readdirSync(buttonsPath1).filter(
        (file) => file.endsWith(".js"),
    );

    for (const file of buttonFiles) {
        const filePath = path.join(buttonsPath1, file);
        const button = require(filePath);
        if ("data" in button && "execute" in button) {
            client.buttons.set(button.data.name, button);
        } else {
            console.log(`[WARNING] The button at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}


const modalsPath = path.join(__dirname, "src/modals");
const modalsFolders = fs.readdirSync(modalsPath);

for (const modalsFolder of modalsFolders) {
    const modalsPath1 = path.join(modalsPath, modalsFolder);
    const modalFiles = fs.readdirSync(modalsPath1).filter(
        (file) => file.endsWith(".js"),
    );

    for (const file of modalFiles) {
        const filePath = path.join(modalsPath1, file);
        const modal = require(filePath);
        if ("data" in modal && "execute" in modal) {
            client.modals.set(modal.data.name, modal);
        } else {
            console.log(`[WARNING] The modal at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}


process.on("exit", code => {
    console.log(`Exiting with code ${code}`);
});

process.on("uncaughtException", (err, origin) => {
    console.error(`Uncaught exception: ${err}`);
    console.error(`Origin: ${origin}`);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error(`Unhandled rejection: ${reason}`);
    console.error(`Promise: ${promise}`);
});

process.on("warning", (...args) => console.log(...args));


client.login(process.env.TOKEN);