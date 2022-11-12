const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { channelPanelId, channelPanelIdTest, guild, adminCateId, adminCateIdTest } = require("../../constVar");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setDescription("🚧〢Pour setup le panel !")
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
            if (interaction.channelId === channelPanelId || interaction.channel.parentId === adminCateId) {
                interaction.channel.send({
                    embeds: [embed],
                    components: [new ActionRowBuilder().addComponents(createButton, renameButton, docButton)],
                });

                return interaction.reply({
                    content: "Le panel a bien été déployé ci desous !",
                    ephemeral: true,
                });

            } else {
                return interaction.reply({
                    content: "Tu ne peux pas déployer le panel dans ce salon !",
                    ephemeral: true,
                });
            }
        } else {
            if (interaction.channelId === channelPanelIdTest || interaction.channel.parentId === adminCateIdTest) {
                interaction.channel.send({
                    embeds: [embed],
                    components: [new ActionRowBuilder().addComponents(createButton, renameButton, docButton)],
                });

                return interaction.reply({
                    content: "Le panel a bien été déployé ci desous !",
                    ephemeral: true,
                });

            } else {
                return interaction.reply({
                    content: "Tu ne peux pas déployer le panel dans ce salon !",
                    ephemeral: true,
                });
            }
        }
    },
};
