const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

/**
 * Come from the button "Le renommer" in the file "src\commands\contextMenus\pseudo.js".
 */

module.exports = {
    data: {
        name: "admin-rename",
    },
    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId("modal-pseudo")
            .setTitle("Changer le pseudo de ...");

        const newPseudo = new TextInputBuilder()
            .setCustomId("newPseudo")
            .setLabel("Quel est son nouveau pseudo ?")
            .setPlaceholder("Prénom ...")
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(newPseudo));

        await interaction.showModal(modal);
    },
};