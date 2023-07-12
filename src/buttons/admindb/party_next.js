const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Party } = require("../../dbObjects");

/**
 * Come from src/commands/admin/admindb.js
 * And src/buttons/admindb/party_next.js and src/buttons/admindb/party_previous.js
 */

module.exports = {
    data: {
        name: "party_next",
    },
    async execute(interaction) {
        // Get information about the party
        const oldEmbed = interaction.message.embeds[0];
        const currentPage = parseInt(oldEmbed.footer.text.split(" ")[1].split("/")[0]);
        const pageCount = parseInt(oldEmbed.footer.text.split(" ")[1].split("/")[1]);

        // Recovering constants
        const pageSize = 10;
        let parties;
        try {
            parties = await Party.findAll();
        } catch (error) {
            console.error("party_next.js - " + error);
            return interaction.reply({ content: "Une erreur est survenue lors de l'affichage de la liste.", ephemeral: true });
        }

        // Displaying the next page of the party
        const nextPage = currentPage + 1;
        const startIndex = (nextPage - 1) * pageSize;
        const endIndex = nextPage * pageSize;
        const partyPage = parties.slice(startIndex, endIndex);

        // Display the party
        const fields = [];
        partyPage.forEach(({ category_id, organizer_id, panel_organizer_id, channel_organizer_only, channel_without_organizer, channel_date_id }) => {
            fields.push({ name: `Id: ${category_id}`, value: `Panel: <#${panel_organizer_id}> - <@${organizer_id}>\nChannels: <#${channel_organizer_only}>・<#${channel_without_organizer}>\nDate: <#${channel_date_id}>` });
        });
        const embed = new EmbedBuilder()
            .setTitle(oldEmbed.title)
            .setDescription(oldEmbed.description)
            .setFields(fields)
            .setColor(oldEmbed.color)
            .setFooter({ text: `Page ${nextPage}/${pageCount}` });

        // Displaying the navigation buttons
        const navigationRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("party_previous")
                    .setLabel("◀️")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(nextPage === 1),
                new ButtonBuilder()
                    .setCustomId("party_next")
                    .setLabel("▶️")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(nextPage === pageCount),
            );

        return interaction.update({ embeds: [embed], components: [navigationRow], ephemeral: true });
    },
};