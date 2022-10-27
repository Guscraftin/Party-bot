const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Pour setup le panel !")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

    async execute(interaction) {
        const createButton = new ButtonBuilder()
            .setCustomId("createCate")
            .setLabel("Créer une soirée !")
            .setStyle(ButtonStyle.Success);

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Bienvenue sur le panel de contrôle")
            .setDescription("Expliquer le fonctionnement, les boutons, créer, quitter/supprimer une caté...");

        await interaction.reply({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(createButton)],
        });
    },
};
