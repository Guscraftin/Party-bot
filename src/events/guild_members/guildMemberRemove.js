const { Collection, Events } = require("discord.js");
const { Party } = require("../../dbObjects");
const { adminMessageId } = require(process.env.CONST);

/**
 * If a member leave the server in the main server,
 * Send a message in all organizer channel
 */

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        if (member.guild.id !== process.env.GUILD_ID) return;

        // Send a message in the admin channel
        const adminChannel = await member.guild.channels.fetch(adminMessageId);
        if (adminChannel && !(adminChannel instanceof Collection)) {
            await adminChannel.send(`${member} a quitté le serveur !`);
        }

        // Send a message in all organizer channel
        const allParty = await Party.findAll();
        await allParty.forEach(async function(party) {
            // TODO: Send a message in admin message channel if the organizer of a party is not in the server
            // TODO: Remove organizer to the party if he is not in the server (organizer list and guest list in DB)

            const panelOrganizerChannel = await member.guild.channels.fetch(party.panel_organizer_id);
            if (panelOrganizerChannel && !(panelOrganizerChannel instanceof Collection)) {
                await panelOrganizerChannel.send(`**${member} a quitté le serveur !**\n` +
                "Par conséquent, il a également quitté ta soirée s'il été invité !");
            }
        });
    },
};
