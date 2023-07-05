const { Events } = require("discord.js");
const { Party } = require("../../dbObjects");
const { channelPanelId } = require(process.env.CONST);

/**
 * If a category is deleted in the main server,
 * Delete the category in the database and delete all channels which is not in a category (except the channel panel)
 */

module.exports = {
    name: Events.ChannelDelete,
    async execute(channel) {
        if (channel.guild.id !== process.env.GUILD_ID) return;

        // Type 4: category
        if (channel.type === 4) {
            // Delete the category in the database
            await Party.destroy({ where: { category_id: channel.id } });

            // Delete all channels which is not in a category (except the channel panel)
            await channel.guild.channels.fetch().then(channels => channels.each(function(channel1) {
                if (channel1.type !== 4) {
                    if (channel1.parent === null && channel1.id != channelPanelId) {
                        channel1.delete();
                    }
                }
            }));
        }
    },
};
