const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { channelPanelId, adminCateId } = require(process.env.CONST);

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
            .setDescription("> __Voici le panel principal qui vous permet de :__\n> \n" +
            "> -> **🎉・Créer une soirée :** Une catégorie sera créer où vous pourrez organiser votre soirée ou votre événement;\n> \n" +
            "> -> **✏️・Se renommer :** Vous permet de vous renommer sur le serveur notamment pour faciliter les invitations aux événements;\n> \n" +
            "> -> **📰・Documentation :** Pour une explication détaillée des principales fonctionnalités disponibles sur ce serveur.\n\n" +
            "*Ces fonctionnalités sont disponible en cliquant sur les boutons ci dessous.*");

        if (interaction.channelId === channelPanelId || interaction.channel.parentId === adminCateId) {
            await interaction.channel.send({
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
    },
};
