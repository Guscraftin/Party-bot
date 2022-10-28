const { Events } = require("discord.js");
const { deleteCate } = require("../utils/utilities");
const { channelPanelId, channelPanelIdTest } = require("../constVar");

module.exports = {
    name: Events.ChannelDelete,
    async execute(channel) {
        if (channel.type === 4) {
            await deleteCate(channel.id);

            await channel.guild.channels.fetch().then(channels => channels.each(function(channel1) {
                if (channel1.type !== 4) {
                    if (channel1.parent === null && channel1.id != channelPanelId && channel1.id != channelPanelIdTest) {
                        channel1.delete();
                    }
                }
            }));
        }
    },
};
