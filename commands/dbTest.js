const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { createCate, addInvite, removeInvite } = require("../utils/utilities");

// Ajouter pour delete une caté (dans utilities aussi)

module.exports = {
    data: new SlashCommandBuilder()
        .setName("db_test")
        .setDescription("Pour tester les interactions avec la db !")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("type_interaction")
                .setDescription("Le type d'intéraction à test sur la db")
                .setRequired(true)
                .addChoices(
                    {
                        name: "createCate",
                        value: "createCate",
                    },
                    {
                        name: "addInvite",
                        value: "addInvite",
                    },
                    {
                        name: "removeInvite",
                        value: "removeInvite",
                    }),
        )
        .addChannelOption(option =>
            option.setName("catégorie")
                .setDescription("La catégorie pour le test de la db")
                .addChannelTypes(ChannelType.GuildCategory)
                .setRequired(true),
        )
        .addUserOption(option =>
            option.setName("membre")
                .setDescription("Le membre invité"),
        ),
    async execute(interaction) {
        const typeInteraction = interaction.options.get("type_interaction");
        const channel = interaction.options.get("catégorie");
        const membre = interaction.options.get("membre");

        switch (typeInteraction.value) {
        case "createCate":
            createCate(channel.value, interaction.member.id);
            break;
        case "addInvite":
            if (!membre) return interaction.reply({ content: "Veuillez entrer un membre !", ephemeral: true });
            addInvite(channel.value, membre.id);
            break;
        case "removeInvite":
            if (!membre) return interaction.reply({ content: "Veuillez entrer un membre !", ephemeral: true });
            removeInvite(channel.value, membre.id);
            break;
        }
        return interaction.reply({ content: "Interaction réalisé !", ephemeral: true });
    },
};
