const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

/**
 * Manage manually the database
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admindb")
        .setDescription("🚧〢Pour gérer la base de donnée !")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("add")
                .setDescription("🚧〢Pour ajouter une soirée à la db !"))
        .addSubcommand(subcommand =>
            subcommand.setName("list")
                .setDescription("🚧〢Pour tester la base de donnée !"))
        .addSubcommand(subcommand =>
            subcommand.setName("edit")
                .setDescription("🚧〢Pour modifier une soirée de la db !"))
        .addSubcommand(subcommand =>
            subcommand.setName("remove")
                .setDescription("🚧〢Pour supprimer une soirée de la db !"))
        .addSubcommand(subcommand =>
            subcommand.setName("clear")
                .setDescription("🚧〢Pour supprimer toutes les soirées de la db !")),
    async execute(interaction) {

        switch (interaction.options.getSubcommand()) {
            /**
             * Add a new party to the database
             */
            case "add":
                await interaction.reply("🚧〢Commande en cours de développement !");
                break;

            /**
             * List all parties in the database
             */
            case "list":
                await interaction.reply("🚧〢Commande en cours de développement !");
                break;

            /**
             * Edit a party in the database
             */
            case "edit":
                await interaction.reply("🚧〢Commande en cours de développement !");
                break;

            /**
             * Remove a party in the database
             */
            case "remove":
                await interaction.reply("🚧〢Commande en cours de développement !");
                break;

            /**
             * Clear all parties in the database
             */
            case "clear":
                await interaction.reply("🚧〢Commande en cours de développement !");
                break;

            default:
                return interaction.reply("🚧〢Commande en cours de développement !");
        }

    },
};
