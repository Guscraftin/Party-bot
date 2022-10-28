const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { channelPanelId, channelPanelIdTest, guild } = require("../../constVar");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setDescription("Pour setup le panel !")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

    async execute(interaction) {
        const createButton = new ButtonBuilder()
            .setCustomId("createCate")
            .setLabel("🎉・Créer une soirée !")
            .setStyle(ButtonStyle.Success);

        const renameButton = new ButtonBuilder()
            .setCustomId("rename")
            .setLabel("✏️・Se renommer")
            .setStyle(ButtonStyle.Primary);

        const docButton = new ButtonBuilder()
            .setCustomId("documentation")
            .setLabel("📰・Documentation")
            .setStyle(ButtonStyle.Secondary);

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Bienvenue sur le panel de contrôle")
            .setDescription("Explication rapide des choses essentiels car il y aura la doc");

        if (interaction.guild == guild) {
            await interaction.client.channels.fetch(channelPanelId).then(function(channel) {
                channel.send({
                    embeds: [embed],
                    components: [new ActionRowBuilder().addComponents(createButton, renameButton, docButton)],
                });
            });

            return interaction.reply({
                content: `Le panel a bien été envoyé dans <#${channelPanelId}> !`,
                ephemeral: true,
            });
        } else {
            await interaction.client.channels.fetch(channelPanelIdTest).then(function(channel) {
                channel.send({
                    embeds: [embed],
                    components: [new ActionRowBuilder().addComponents(createButton, renameButton, docButton)],
                });
            });

            return interaction.reply({
                content: `Le panel a bien été envoyé dans <#${channelPanelIdTest}> !`,
                ephemeral: true,
            });
        }
    },
};
