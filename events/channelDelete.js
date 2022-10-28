const { Events } = require("discord.js");
const { deleteCate } = require("../utils/utilities");

module.exports = {
    name: Events.ChannelDelete,
    async execute(channel) {
        const channelPanel = "1034902200616484995";
        const channelPanelTest = "1035497108922454046";

        if (channel.type === 4) {
            await deleteCate(channel.id);

            await channel.guild.channels.fetch().then(channels => channels.each(function(channel1) {
                if (channel1.type !== 4) {
                    if (channel1.parent === null && channel1.id != channelPanel && channel1.id != channelPanelTest) {
                        channel1.delete();
                    }
                }
            }));
        }
    },
};
