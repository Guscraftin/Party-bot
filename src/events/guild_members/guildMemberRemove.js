const { Events } = require("discord.js");
const { isPanelOrga } = require("../../_utils/utilities");
const { guild, guildTest, adminMessageId, adminMessageIdTest, adminCateId, adminCateIdTest } = require(process.env.CONST);

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        if (member.guild.id === guild) {
            await member.guild.channels.fetch(adminMessageId).then(async function(channel) {
                await channel.send(`<@${member.id}> a quitté le serveur !`);
            });
        } else if (member.guild.id == guildTest) {
            await member.guild.channels.fetch(adminMessageIdTest).then(async function(channel) {
                await channel.send(`<@${member.id}> a quitté le serveur !`);
            });
        } else {
            return;
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
