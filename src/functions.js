const { Collection, PermissionFlagsBits } = require("discord.js");
const { Party } = require("./dbObjects");
const { adminCateId, channelPanelId } = require(process.env.CONST.replace("../.", ""));

/**
 * Syncs the database with the category party
 * @param {import("discord.js").Guild} guild
 * @param {import("discord.js").Channel} channel
 * @returns {boolean} If the party has been correctly synced
 */
async function syncParty(guild, channel) {
    /**
     * Get the party in the database
     */
    if (!channel) return false;
    if (channel.type !== 4) {
        if (channel.parentId === null && channel.id !== channelPanelId) await channel.delete();
        return false;
    }

    const party = await Party.findOne({ where: { category_id: channel.id } });
    if (!party) {
        if (channel.id !== adminCateId) {
            await Promise.all(channel.children.cache.map(async function(channel1) {
                await channel1.delete();
            }));
            await channel.delete();
        }
        return false;
    }


    /**
     * Update the database
     */
    const newGuestList = [];
    const newOrganizerList = [];
    const listNewPerm = channel.permissionOverwrites.cache;
    listNewPerm.each(async function(perm) {
        // If the permission is for a member
        if (perm.type === 1) {
            // Get the list of member who can see the category
            if (perm.allow.has(PermissionFlagsBits.ViewChannel) && perm.id !== party.organizer_id) {
                newGuestList.push(perm.id);
                if (perm.allow.has(PermissionFlagsBits.SendMessages)) newOrganizerList.push(perm.id);
            }
        }
    });
    try {
        await party.update({ guest_list_id: newGuestList, organizer_list_id: newOrganizerList });
    } catch (error) {
        console.error("channelUpdate guestList - " + error);
    }


    /**
     * Spread the permission in the category
     */
    // For particular channels
    const withoutOrgaChannel = await guild.channels.fetch(await party.channel_without_organizer);
    const organizersOnlyChannel = await guild.channels.fetch(await party.channel_organizer_only);
    if (!withoutOrgaChannel || withoutOrgaChannel instanceof Collection) return false;
    if (!organizersOnlyChannel || organizersOnlyChannel instanceof Collection) return false;

    const newOrganizerPerms = [];
    const newGuestPerms = [];
    newGuestList.forEach(guest => {
        if (newOrganizerList.includes(guest)) {
            newOrganizerPerms.push({
                id: guest,
                allow: PermissionFlagsBits.ViewChannel,
            });
        } else {
            newGuestPerms.push({
                id: guest,
                allow: PermissionFlagsBits.ViewChannel,
            });
        }
    });
    await withoutOrgaChannel.permissionOverwrites.set(newGuestPerms);
    await organizersOnlyChannel.permissionOverwrites.set(newOrganizerPerms);

    // For locked channels
    await Promise.all(party.channels_locked_id.map(async channelLock => {
        const channelLocked = await guild.channels.fetch(channelLock);
        if (channelLocked && !(channelLocked instanceof Collection)) {
            await channelLocked.lockPermissions();
            await channelLocked.permissionOverwrites.edit(guild.id, {
                ViewChannel: false,
                SendMessages: false,
            });
            await Promise.all(newGuestList.map(async guest => {
                if (newOrganizerList.includes(guest)) {
                    await channelLocked.permissionOverwrites.edit(guest, {
                        ViewChannel: true,
                        SendMessages: true,
                    });
                } else {
                    await channelLocked.permissionOverwrites.edit(guest, {
                        ViewChannel: true,
                    });
                }
            }));
        }
    }));

    // For unlocked channels, it's already synced with the category


    return true;
}

module.exports = { syncParty };