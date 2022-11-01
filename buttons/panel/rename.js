const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    data: {
        name: "rename",
    },
    async execute(interaction) {
        if (interaction.member.id === interaction.guild.ownerId) {
            return interaction.reply({
                content: "Etant le propriétaire du serveur, le bot ne peut pas te renommer !",
                ephemeral: true,
            });
        }

        const modal = new ModalBuilder()
            .setCustomId("modal-rename")
            .setTitle("Changer son pseudo");

        const newNameInput = new TextInputBuilder()
            .setCustomId("newName")
            .setLabel("Quel pseudo veux-tu avoir ?")
            .setMinLength(1)
            .setMaxLength(32)
            .setPlaceholder("Tape ton nouveau speudo ici !")
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(newNameInput));

        await interaction.showModal(modal);
    },
};