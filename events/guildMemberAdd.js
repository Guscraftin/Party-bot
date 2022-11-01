const { Events } = require("discord.js");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            await member.send(`Bonjour ${member.username}, je suis \`Party Bot\`, le bot qui gère le serveur **${member.guild.name}**.\n` +
            "Je te contacte pour me présenter et pour te remercier d'avoir rejoint ce serveur.");
            // Plus de détails rapide sur le serveur
        } catch (e) {
            console.error(e);
        }
    },
};