const { Collection, Events, PermissionFlagsBits } = require("discord.js");
const { Party } = require("../../dbObjects");

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

            /*
             * If the permission for new or old member to see the category has changed
             */

            // Update the database
            const newGuestList = [];
            await listNewPerm.each(async function(perm) {
                // If the permission is for a member
                if (perm.type === 1) {
                    // Get the list of member who can see the category
                    if (await perm.allow.has(PermissionFlagsBits.ViewChannel) && perm.id !== process.env.CLIENT_id && perm.id !== party.organizer_id) {
                        newGuestList.push(perm.id);
                    }
                }
            });
            try {
                await party.update({ guest_list_id: newGuestList });
            } catch (error) {
                console.error("channelUpdate guestList - " + error);
            }

            // Propagate category changes
            await category.children.cache.each(async function(channel) {
                // if (party.channel_without_organizer === channel.id) {
                //     // TODO: Can add/remove user as guest direct in permission of the category
                //     // TODO: Update the permission of the channel without give access to organizer even a few seconds
                //     // TODO: Do it in the invite command + leave category
                //     // Get the list og organizer
                //     const listOrganizer = [];
                //     try {
                //         listOrganizer.push(await newChannel.guild.members.fetch(party.organizer_id));
                //         await party.organizer_list_id.forEach(async function(organizer) {
                //             const member = await newChannel.guild.members.fetch(organizer);
                //             if (member) listOrganizer.push(member);
                //         });
                //     } catch (error) {
                //         console.error("channelUpdate listOrganizer - " + error);
                //     }

                //     // Update the permission of the channel without organizer
                //     await channel.lockPermissions();
                //     listOrganizer.forEach(async function(organizer) {
                //         await channel.permissionOverwrites.edit(organizer, {
                //             ViewChannel: false,
                //         });
                //     });

                await party.channels_locked_id.forEach(async channelLock => {
                    const channel = await newChannel.guild.channels.fetch(channelLock);
                    if (channel && !(channel instanceof Collection)) {
                        await channel.lockPermissions();
                        await channel.permissionOverwrites.edit(newChannel.guild.id, {
                            SendMessages: false,
                        });
                    }
                });
            });
        }
    },
};
