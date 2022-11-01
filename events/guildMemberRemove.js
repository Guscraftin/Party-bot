const { Events } = require("discord.js");
const { guild, adminMessageId, adminMessageIdTest } = require("../constVar.json");

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        if (member.guild.id === guild) {
            await member.guild.channels.fetch(adminMessageId).then(async function(channel) {
                await channel.send(`<@${member.id}> a quitté le serveur !`);
            });
        } else {
            await member.guild.channels.fetch(adminMessageIdTest).then(async function(channel) {
                await channel.send(`<@${member.id}> a quitté le serveur !`);
            });
        }
    },
};
