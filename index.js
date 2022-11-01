const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token, database_uri } = require("./config.json");
// const { tokenTest, database_uri } = require("./config.json");
const mongoose = require("mongoose");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();


const commandsPath = path.join(__dirname, "commands");
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


const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}


const buttonsPath = path.join(__dirname, "buttons");
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


const modalsPath = path.join(__dirname, "modals");
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


mongoose.connect(database_uri, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
}).then(() => console.log("Connected to database.")).catch(err => console.error(err));


client.login(token);
// client.login(tokenTest);
