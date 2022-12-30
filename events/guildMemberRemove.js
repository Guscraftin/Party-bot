const { Events } = require("discord.js");
const { isPanelOrga } = require("../utils/utilities");
const { guild, adminMessageId, adminMessageIdTest, adminCateId, adminCateIdTest } = require("../constVar.json");

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

        await member.guild.channels.fetch().then(async function(channels) {
            await channels.filter(channel => channel.parentId != null && channel.parentId != adminCateId && channel.parentId != adminCateIdTest).each(async function(channel) {
                if (await isPanelOrga(channel.parentId, channel.id)) {
                    await channel.send(`**<@${member.id}> a quitté le serveur !**\n` +
                    "Par conséquent, il a également quitté ta soirée s'il été invité !");
                }
            });
        });
    },
};
