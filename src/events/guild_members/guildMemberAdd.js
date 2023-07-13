const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, Events } = require("discord.js");
const { Party } = require("../../dbObjects");
const { channelPanelId } = require(process.env.CONST);

/**
 * If a member join the server in the main server,
 * Send a welcome message to the new member and send a message in all organizer channel
 */

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (member.guild.id !== process.env.GUILD_ID) return;

        // Send a welcome message to the new member
        try {
            const panelButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Lien vers le panel")
                        .setURL(`https://discord.com/channels/${process.env.GUILD_ID}/${channelPanelId}`)
                        .setStyle(ButtonStyle.Link),
                );

            await member.send({ content: `👋 Bonjour ${member.user.username}, je suis \`Party Bot\`, le bot qui gère le serveur **${member.guild.name}**.\n` +
            "Je te contacte pour me présenter et pour te remercier d'avoir rejoint ce serveur.\n\n" +
            "> Sur celui-ci, tu pourras **organiser ta propre fête ou ton propre événement** 🎉 !\n" +
            "> De plus, tu pourras facilement être invité aux fêtes organisées sur le serveur.\n" +
            "> D'ailleurs, en rejoingnant ce serveur, tu diminues le risque d'être oublié dans la liste des invités à un événement.\n\n" +
            "**N'oublie pas de te renommer avec ton prénom** grâce au bouton sous le panel et **d'inviter tes amis** pour toi aussi organiser tes fêtes sur ce serveur avec tout le monde 😉 !", components: [panelButton] });
        } catch (error) {
            console.error("guildMemberAdd - " + error);
        }

        // Send a message in all organizer channel
        const allParty = await Party.findAll();
        await allParty.forEach(async function(party) {
            const panelOrganizerChannel = await member.guild.channels.fetch(party.panel_organizer_id);
            if (panelOrganizerChannel && !(panelOrganizerChannel instanceof Collection)) {
                await panelOrganizerChannel.send(`**${member} a rejoint le serveur !**\n` +
                `Si tu souhaites l'inviter à ta fête, tu peux désormais le faire avec la commande \`/invite ajouter @${member.displayName}\` !`);
            }
        });
    },
};