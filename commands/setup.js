const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Pour setup le panel !")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        return interaction.reply({ content: "Voici le message qui explique fonctionnement et les bouton, créer et quitter/supprimer une caté !", ephemeral: true });
    },
};
