const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Party } = require("../../dbObjects");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("categorie")
        .setDescription("Pour gérer cette catégorie !")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("quitter")
                .setDescription("👤〢Pour quitter cette soirée (cette catégorie)."))
        .addSubcommand(subcommand =>
            subcommand.setName("supprimer")
                .setDescription("🎉〢Pour supprimer cette soirée (sa catégorie).")),

    async execute(interaction) {
        const party = await Party.findOne({ where: { category_id: interaction.channel.parentId, organizer_id: interaction.member.id } });

        const leaveButton = new ButtonBuilder()
            .setCustomId("leaveCate")
            .setLabel("Quitter cette soirée !")
            .setStyle(ButtonStyle.Danger);

        const deletedButton = new ButtonBuilder()
            .setCustomId("deletedCate")
            .setLabel("Supprimer cette soirée !")
            .setStyle(ButtonStyle.Danger);

        switch (interaction.options.getSubcommand()) {
            /**
             * Leave the party only if the user is not the main organizer
             */
            case "quitter":
                if (party) {
                    return interaction.reply({
                        content: `Tu ne peux pas quitter ta propre soirée ? (\`${interaction.channel.parent.name}\`)\n\nSi c'est une erreur, tape cette commande \`/categorie supprimer\`.`,
                        ephemeral: true,
                    });
                } else {
                    return interaction.reply({
                        content: `Es-tu sûr de vouloir quitter cette soirée ? (\`${interaction.channel.parent.name}\`)\n\nSi c'est une erreur, rejete ce message pour éviter de cliquer sur le bouton rouge de départ.`,
                        ephemeral: true,
                        components: [new ActionRowBuilder().addComponents(leaveButton)],
                    });
                }

            /**
             * Delete the party only if the user is the main organizer
             */
            case "supprimer":
                if (!party) {
                    return interaction.reply({
                        content: "Tu dois être l'organisateur de cette soirée (de cette catégorie) pour pouvoir gérer les invités !\nSi tu es organisateur et que tu veux gérer tes invités, tape cette commande dans la catégorie de ta soirée.",
                        ephemeral: true,
                    });
                } else {
                    return interaction.reply({
                        content: `Es-tu sûr de vouloir supprimer cette soirée ? (\`${interaction.channel.parent.name}\`)` +
                        "\n\nSi c'est une erreur, rejete ce message pour éviter de cliquer sur le bouton rouge de suppression.",
                        ephemeral: true,
                        components: [new ActionRowBuilder().addComponents(deletedButton)],
                    });
                }

            default:
                return interaction.reply({
                    content: "Votre commande a recontrée des problèmes, contacter l'administrateur !",
                    ephemeral: true,
                });
        };
    },
};
