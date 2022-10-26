const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { createCate, isAddInvite, isRemoveInvite, deleteCate } = require("../utils/utilities");

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
                        name: "deleteCate",
                        value: "deleteCate",
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
            case "deleteCate":
                deleteCate(channel.value);
                break;
            case "addInvite":
                if (!membre) return interaction.reply({ content: "Veuillez entrer un membre !", ephemeral: true });
                if (await isAddInvite(channel.value, membre.id)) {
                    return interaction.reply({ content: `<@${membre.id}> a bien été ajouté sur votre liste d'invités pour votre soirée !`, ephemeral: true });
                } else {
                    return interaction.reply({ content: `<@${membre.id}> est déjà sur votre liste d'invités à votre soirée !`, ephemeral: true });
                }
            case "removeInvite":
                if (!membre) return interaction.reply({ content: "Veuillez entrer un membre !", ephemeral: true });
                if (await isRemoveInvite(channel.value, membre.id)) {
                    return interaction.reply({ content: `<@${membre.id}> a bien été retiré de votre liste d'invités pour votre soirée !`, ephemeral: true });
                } else {
                    return interaction.reply({ content: `<@${membre.id}> n'est déjà pas invité à votre soirée !`, ephemeral: true });
                }
        }
        return interaction.reply({ content: "L'interaction a rencontré un problème !", ephemeral: true });
    },
};
