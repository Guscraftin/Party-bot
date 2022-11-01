const { isRemoveInvite, isPanelOrga } = require("../../utils/utilities");

module.exports = {
    data: {
        name: "leaveCate",
    },
    async execute(interaction) {
        const channel = interaction.channel;
        const cateId = channel.parentId;
        const membre = interaction.member;

        if (await isRemoveInvite(cateId, membre.id)) {
            await channel.parent.permissionOverwrites.delete(membre, `Par la volonté de l'invité (${membre.id}) !`);
            await channel.parent.children.cache.each(function(channel1) {
                channel1.permissionOverwrites.delete(membre);
            });

            await channel.parent.children.cache.each(async function(channel1) {
                if (await isPanelOrga(cateId, channel1.id)) {
                    channel1.send(`<@${membre.id}> a quitté ta soirée !`);
                }
            });
        } else {
            return interaction.reply({
                content: `<@${membre.id}> n'a pas pu être retiré de cette soirée !`,
                ephemeral: true,
            });
        }
    },
};