const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { isOrgaCate } = require("../../utils/utilities");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("categorie")
        .setDescription("Pour gérer cette catégorie !")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("quitter")
                .setDescription("Pour quitter cette soirée (cette catégorie)."))
        .addSubcommand(subcommand =>
            subcommand.setName("supprimer")
                .setDescription("Pour supprimer cette soirée (sa catégorie).")),

    async execute(interaction) {
        const leaveButton = new ButtonBuilder()
            .setCustomId("leaveCate")
            .setLabel("Quitter cette soirée !")
            .setStyle(ButtonStyle.Danger);

        const deletedButton = new ButtonBuilder()
            .setCustomId("deletedCate")
            .setLabel("Supprimer cette soirée !")
            .setStyle(ButtonStyle.Danger);

        switch (interaction.options.getSubcommand()) {
            case "quitter":
                if (!await isOrgaCate(interaction.channel.parentId, interaction.member.id)) {
                    return interaction.reply({
                        content: `Es-tu sûr de vouloir quitter cette soirée ? (\`${interaction.channel.parent.name}\`)\n\nSi c'est une erreur, rejete ce message pour éviter de cliquer sur le bouton rouge de départ.`,
                        ephemeral: true,
                        components: [new ActionRowBuilder().addComponents(leaveButton)],
                    });
                } else {
                    return interaction.reply({
                        content: `Tu ne peux pas quitter ta propre soirée ? (\`${interaction.channel.parent.name}\`)\n\nSi c'est une erreur, tape cette commande \`/categorie supprimer\`.`,
                        ephemeral: true,
                    });
                };

            case "supprimer":
                if (!await isOrgaCate(interaction.channel.parentId, interaction.member.id)) {
                    return interaction.reply({
                        content: "Tu dois être l'organisateur de cette soirée (de cette catégorie) pour pouvoir gérer les invités !\nSi tu es organisateur et que tu veux gérer tes invités, tape cette commande dans la catégorie de ta soirée.",
                        ephemeral: true,
                    });
                } else {
                    return interaction.reply({
                        content: `Es-tu sûr de vouloir supprimer cette soirée ? (\`${interaction.channel.parent.name}\`)\n\nSi c'est une erreur, rejete ce message pour éviter de cliquer sur le bouton rouge de suppression.`,
                        ephemeral: true,
                        components: [new ActionRowBuilder().addComponents(deletedButton)],
                    });
                }

            default:
                return interaction.reply({ content: "Votre interaction a recontré des problèmes, contacter l'administrateur !", ephemeral: true });
        };
    },
};
