const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { Users } = require("../../dbObjects");
const { color_basic } = require(process.env.CONST);

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Profil")
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        // Get the information about the user
        const user = await Users.findOne({ where: { user_id: interaction.targetId } });
        if (!user) return interaction.reply({ content: "Cet utilisateur n'est pas dans la base de données.", ephemeral: true });

        const userDiscord = await interaction.guild.members.fetch(interaction.targetId);

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${userDiscord.displayName} (${userDiscord.id})`, iconURL: userDiscord.user.displayAvatarURL() })
            .setColor(color_basic)
            .setDescription("Voici les informations de ce membre :")
            .setFields([
                { name: "Prénom", value: user.first_name, inline: true },
            ])
            .setTimestamp()
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};