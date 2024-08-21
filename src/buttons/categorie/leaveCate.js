const { Collection } = require("discord.js");
const { Party } = require("../../dbObjects");

/**
 * Come from the command "categorie quitter" in the file "src\command\invite\categorie.js".
 * Leave the category (party) for the user.
 */

module.exports = {
    data: {
        name: "leaveCate",
    },
    async execute(interaction) {
        const channel = interaction.channel;
        const cateId = channel.parentId;
        const member = interaction.member;

        const party = await Party.findOne({ where: { category_id: cateId } });
        if (!party) return interaction.reply({ content: "Une erreur est survenue lors de la récupération de la fête !", ephemeral: true });

        const bot = await interaction.client.application.fetch();
        if (!party.guest_list_id.includes(member.id)) return interaction.reply({ content: `Veuillez contacter <@${bot.owner.id}> car un problème de permissions vous empêche de quitter cette fête !`, ephemeral: true });

        let isOrga = false;
        // Remove the user from the organizer list
        if (party.organizer_list_id.includes(member.id)) {
            const organizersOnlyChannel = await interaction.guild.channels.fetch(party.channel_organizer_only);
            if (organizersOnlyChannel && !(organizersOnlyChannel instanceof Collection)) await organizersOnlyChannel.permissionOverwrites.delete(member, `Par la volonté du membre (${member.id}) !`);

            try {
                const listOrganizer = party.organizer_list_id;
                const index = listOrganizer.indexOf(member.id);
                if (index > -1) {
                    listOrganizer.splice(index, 1);
                    await party.update({ organizer_list_id: listOrganizer });
                }
            } catch (error) {
                console.error("leaveCate orga - " + error);
                return interaction.reply({ content: "Une erreur est survenue lors de votre retrait à cette fête !", ephemeral: true });
            }

            isOrga = true;
        }

        // Remove the user from the guest list
        const index = party.guest_list_id.indexOf(member.id);
        if (index > -1) {
            party.guest_list_id.splice(index, 1);
        }
        try {
            await party.update({ guest_list_id: party.guest_list_id });
        } catch (error) {
            console.error("leaveCate guest - " + error);
            return interaction.reply({ content: "Une erreur est survenue lors de la mise à jour de la base de données !", ephemeral: true });
        }

        const withoutOrgaChannel = await interaction.guild.channels.fetch(party.channel_without_organizer);
        if (withoutOrgaChannel && !(withoutOrgaChannel instanceof Collection)) await withoutOrgaChannel.permissionOverwrites.delete(member, `Par la volonté de l'organisateur (${member.id}) !`);

        await channel.parent.permissionOverwrites.delete(member, `Par la volonté de l'invité (${member.id}) !`);

        const panelOrga = await interaction.guild.channels.fetch(await party.panel_organizer_id);
        if (panelOrga && !(panelOrga instanceof Collection)) {
            panelOrga.send(`**<@${member.id}> a quitté votre fête${isOrga ? ", il était organisateur" : ""} !**`);
        }
    },
};