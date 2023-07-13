const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { Party } = require("../../dbObjects");
const { maxParty } = require(process.env.CONST);

/**
 * Come from the button "Créer une fête" in the file "src\buttons\panel\panel.js".
 * Create a new category (party) for the user.
 */

module.exports = {
    data: {
        name: "createCate",
    },
    async execute(interaction) {
        const partyCount = await Party.count({ where: { organizer_id: interaction.member.id } });
        if (partyCount && partyCount >= maxParty) {
            return interaction.reply({
                content: `Tu ne peux plus créer de nouvelles fêtes (catégorie) car tu as déjà \`${maxParty}\` catégories.`,
                ephemeral: true,
            });
        }

        const modal = new ModalBuilder()
            .setCustomId("modal-createCate")
            .setTitle("Créer une fête");

        const dateStartInput = new TextInputBuilder()
            .setCustomId("dateStart")
            .setLabel("Date du début de votre fête ? (DD/MM/YYYY)")
            .setMinLength(10)
            .setMaxLength(10)
            .setPlaceholder("13/07/2023")
            .setStyle(TextInputStyle.Short);

        const dateEndInput = new TextInputBuilder()
            .setCustomId("dateEnd")
            .setLabel("Date de fin de votre fête ? (DD/MM/YYYY)")
            .setMinLength(10)
            .setMaxLength(10)
            .setPlaceholder("15/07/2023")
            .setStyle(TextInputStyle.Short);

        modal.addComponents(
            new ActionRowBuilder().addComponents(dateStartInput),
            new ActionRowBuilder().addComponents(dateEndInput),
        );

        await interaction.showModal(modal);
    },
};