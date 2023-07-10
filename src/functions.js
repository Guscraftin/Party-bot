const { Collection, PermissionFlagsBits } = require("discord.js");
const { Party } = require("./dbObjects");
// const { adminCateId } = require(process.env.CONST.replace("../", ''));

/**
 * Syncs the database with the category party
 * @param {import("discord.js").Guild} guild
 * @param {string} cateId
 * @returns {boolean} If the party has been correctly synced
 */
async function syncParty(guild, cateId) {
    /**
     * Get the party in the database
     */
    const party = await Party.findOne({ where: { category_id: cateId } });
    const category = await guild.channels.fetch(cateId);
    if (!party || !category) return false;


    /**
     * Update the database
     */
    const newGuestList = [];
    const newOrganizerList = [];
    const listNewPerm = await category.permissionOverwrites.cache;
    await listNewPerm.each(async function(perm) {
        // If the permission is for a member
        if (perm.type === 1) {
            // Get the list of member who can see the category
            if (await perm.allow.has(PermissionFlagsBits.ViewChannel) && perm.id !== party.organizer_id) {
                newGuestList.push(perm.id);
                if (await perm.allow.has(PermissionFlagsBits.SendMessages)) newOrganizerList.push(perm.id);
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
        const channel = await guild.channels.fetch(channelLock);
        if (channel && !(channel instanceof Collection)) {
            await channel.lockPermissions();
            await channel.permissionOverwrites.edit(guild.id, {
                ViewChannel: false,
                SendMessages: false,
            });
            await Promise.all(newGuestList.map(async guest => {
                if (newOrganizerList.includes(guest)) {
                    await channel.permissionOverwrites.edit(guest, {
                        ViewChannel: true,
                        SendMessages: true,
                    });
                } else {
                    await channel.permissionOverwrites.edit(guest, {
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