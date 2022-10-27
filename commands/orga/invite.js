const { SlashCommandBuilder } = require("discord.js");
const { isOrgaCate, isAddInvite, isRemoveInvite } = require("../../utils/utilities");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Commande pour gérer les invités dans sa soirée (sa catégorie) !")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("ajouter")
                .setDescription("Pour ajouter un membre à sa soirée (sa catégorie).")
                .addUserOption(option => option.setName("membre").setDescription("Le membre à ajouter").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("retirer")
                .setDescription("Pour retirer un membre à sa soirée (sa catégorie).")
                .addUserOption(option => option.setName("membre").setDescription("Le membre à retirer").setRequired(true))),

    async execute(interaction) {
        const channel = interaction.channel;
        const membre = interaction.options.getMember("membre");
        const cateId = channel.parentId;

        if (!await isOrgaCate(cateId, interaction.member.id)) return interaction.reply({ content: "Tu dois être l'organisateur de cette soirée (de cette catégorie) pour pouvoir gérer les invités !\nSi tu es organisateur et que tu veux gérer tes invités, tape cette commande dans la catégorie de ta soirée.", ephemeral: true });

        if (membre === interaction.member) return interaction.reply({ content: "Vous ne pouvez pas gérer votre invitation car vous êtes déjà l'organisateur de cette soirée !", ephemeral: true });
        if (membre.user.bot) return interaction.reply({ content: "Vous ne pouvez pas gérer l'invitation d'un bot discord à votre soirée !", ephemeral: true });

        switch (interaction.options.getSubcommand()) {
            case "ajouter":
                if (await isAddInvite(cateId, membre.id)) {
                    await channel.parent.permissionOverwrites.create(membre, {
                        ViewChannel: true,
                    });
                    return interaction.reply({ content: `<@${membre.id}> a bien été ajouté sur votre liste d'invités pour votre soirée !`, ephemeral: true });
                } else {
                    return interaction.reply({ content: `<@${membre.id}> est déjà sur votre liste d'invités à votre soirée !`, ephemeral: true });
                }
            case "retirer":
                if (await isRemoveInvite(cateId, membre.id)) {
                    await channel.parent.permissionOverwrites.delete(membre, `Par la volonté de l'organisateur (${membre.id}) !`);
                    return interaction.reply({ content: `<@${membre.id}> a bien été retiré de votre liste d'invités pour votre soirée !`, ephemeral: true });
                } else {
                    return interaction.reply({ content: `<@${membre.id}> n'est déjà pas invité à votre soirée !`, ephemeral: true });
                }
        }
        return interaction.reply({ content: "Votre interaction a rencontré un problème !", ephemeral: true });
    },
};
