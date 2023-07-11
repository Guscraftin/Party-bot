const { Collection, Events, PermissionFlagsBits } = require("discord.js");
const { Party } = require("../../dbObjects");
const { syncParty } = require("../../functions");

/**
 * If the permission in the category has changed in the main server,
 * Update the guest_list and update the channel in the category
 */

module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel) {
        // Return it is a DM or a group DM
        if (newChannel.type === 1 || newChannel.type === 3) return;
        if (newChannel.guild.id !== process.env.GUILD_ID) return;

        const category = newChannel;
        const listOldPerm = oldChannel.permissionOverwrites.cache;
        const listNewPerm = newChannel.permissionOverwrites.cache;

        // Type 4: category
        if (newChannel.type === 4) {
            const party = await Party.findOne({ where: { category_id: category.id } });
            if (!party) return;

            /*
             * If the permission everyone to see the category has changed
             */
            if (listOldPerm.get(newChannel.guild.id).allow.has(PermissionFlagsBits.ViewChannel)
            != listNewPerm.get(newChannel.guild.id).allow.has(PermissionFlagsBits.ViewChannel)) {

                // Send a message to the organizer
                const panelOrganizerChannel = await newChannel.guild.channels.fetch(party.panel_organizer_id);
                if (panelOrganizerChannel && !(panelOrganizerChannel instanceof Collection)) {
                    await panelOrganizerChannel.send("||@everyone||\nAttention, tu permet à tout le monde de voir ou de ne plus voir cette catégorie !\n" +
                    "La fonctionnalité qui permet de répendre les permissions dans ta catégorie n'est pas implémenter." +
                    "Tu vas devoir vérifier toi même toutes les permissions dans tes salons.");
                }
            }


            /**
             * Sync the category with the database
             */
            let isOrganizerInCategory = true;
            if (listNewPerm.get(await party.organizer_id) === undefined || !listNewPerm.get(await party.organizer_id).allow.has(PermissionFlagsBits.ViewChannel)) isOrganizerInCategory = false;

            if (isOrganizerInCategory) {syncParty(newChannel.guild, category);}
            else {
                // Send a message to the organizer
                const panelOrganizerChannel = await newChannel.guild.channels.fetch(party.panel_organizer_id);
                if (panelOrganizerChannel && !(panelOrganizerChannel instanceof Collection)) {
                    await panelOrganizerChannel.send("||@everyone||\n**Attention, tu viens de te priver de la permission de voir et de gérer ta soirée !**\n" +
                    "Envoie un Message Privé à <@265785336175656970> pour régler ce problème.\n");
                }
            }
        }
    },
};
