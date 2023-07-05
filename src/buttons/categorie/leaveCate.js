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
        const membre = interaction.member;

        // TODO: Remove also in list of organizer
        // Remove the user from the party database
        const party = await Party.findOne({ where: { category_id: cateId } });
        if (!party) return interaction.reply({ content: "Une erreur est survenue lors de la récupération de la soirée !", ephemeral: true });

        const index = party.guest_list_id.indexOf(membre.id);
        if (index > -1) {
            party.guest_list_id.splice(index, 1);
        }
        try {
            await party.update({ guest_list_id: party.guest_list_id.join(",") });
        } catch (error) {
            console.error("leaveCate - " + error);
            return interaction.reply({ content: "Une erreur est survenue lors de la mise à jour de la base de données !", ephemeral: true });
        }

        await channel.parent.permissionOverwrites.delete(membre, `Par la volonté de l'invité (${membre.id}) !`);
        await channel.parent.children.cache.each(function(channel1) {
            channel1.permissionOverwrites.delete(membre);
        });

        const panelOrga = await interaction.guild.channels.fetch(await party.panel_organizer_id);
        if (panelOrga) {
            panelOrga.send(`**<@${membre.id}> a quitté la soirée !**`);
        }
    },
};