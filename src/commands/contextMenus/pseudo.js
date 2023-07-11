const { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ContextMenuCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Pseudo")
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction) {
        const member = interaction.options.getMember("user");
        const pseudoLine = member.nickname ? `Il a actuellement pour pseudo : ${member.nickname}` : "Il n'a actuellement pas de pseudo.";
        const bot = await interaction.client.application.fetch();

        // Check the exceptions
        if (interaction.member.id !== bot.owner.id && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: "Tu n'as pas la permission d'utiliser cette commande.", ephemeral: true });
        if (member.user.bot) return interaction.reply({ content: "Tu ne peux pas renommer un bot.", ephemeral: true });
        if (member.user.id === interaction.user.id) return interaction.reply({ content: "Tu ne peux pas te renommer toi même.", ephemeral: true });
        if (member.id === member.guild.ownerId) return interaction.reply({ content: "Tu ne peux pas renommer le propriétaire du serveur.", ephemeral: true });

        // Send the answer
        const renameButton = new ButtonBuilder()
            .setCustomId("admin-rename")
            .setLabel("✏️・Le renommer")
            .setStyle(ButtonStyle.Primary);

        return interaction.reply({
            content: `**Souhaites-tu renommer ${member} par un nouveau pseudo ?**\n${pseudoLine}`,
            components: [new ActionRowBuilder().addComponents(renameButton)],
            ephemeral: true,
        });
    },
};