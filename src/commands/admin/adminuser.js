const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { Users } = require("../../dbObjects");

/**
 * Manage manually the database
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName("adminuser")
        .setDescription("🚧〢Pour gérer la base de donnée des utilisateurs !")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("add")
                .setDescription("🚧〢Pour ajouter un utilisateur dans la db.")
                .addUserOption(option =>
                    option.setName("member").setDescription("L'utilisateur à ajouter.").setRequired(true))
                .addStringOption(option =>
                    option.setName("name").setDescription("Le prénom de la personne.").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("edit")
                .setDescription("🚧〢Pour modifier un utilisateur dans la db.")
                .addUserOption(option =>
                    option.setName("member").setDescription("L'utilisateur à modifier.").setRequired(true))
                .addStringOption(option =>
                    option.setName("name").setDescription("Le prénom de la personne.").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("list")
                .setDescription("🚧〢Pour lister les utilisateurs dans la db."))
        .addSubcommand(subcommand =>
            subcommand.setName("remove")
                .setDescription("🚧〢Pour supprimer un utilisateur de la db.")
                .addUserOption(option =>
                    option.setName("member").setDescription("L'utilisateur à supprimer.").setRequired(true))
                .addBooleanOption(option =>
                    option.setName("confirm").setDescription("Es-tu sur de vouloir supprimer cette personne ?").setRequired(true))),
    async execute(interaction) {
        const user = interaction.options.getUser("member");
        const name = interaction.options.getString("name");
        const confirm = interaction.options.getBoolean("confirm");

        if (user.bot) return interaction.reply({ content: "Tu ne peux pas ajouter un bot dans la base de donnée !", ephemeral: true });

        switch (interaction.options.getSubcommand()) {
            /**
             * Add an user in the database
             */
            case "add": {
                const newUser = await Users.findOne({ where: { user_id: user.id } });
                if (newUser) return interaction.reply({ content: "Cet utilisateur existe déjà dans la base de donnée !", ephemeral: true });

                try {
                    await Users.create({
                        user_id: user.id,
                        first_name: name,
                    });
                    return interaction.reply({ content: "L'utilisateur a bien été ajouté à la base de donnée !", ephemeral: true });
                } catch (error) {
                    console.error("adminuser add - " + error);
                    return interaction.reply({ content: "Une erreur est survenue lors de l'ajout de l'utilisateur dans la base de donnée !", ephemeral: true });
                }
            }


            /**
             * Edit an user in the database
             */
            case "edit": {
                const newUser = await Users.findOne({ where: { user_id: user.id } });
                if (!newUser) return interaction.reply({ content: "Cet utilisateur n'existe pas dans la base de donnée !", ephemeral: true });

                try {
                    if (name) await newUser.update({ first_name: name });

                    return interaction.reply({ content: "L'utilisateur a bien été modifié dans la base de donnée !", ephemeral: true });
                } catch (error) {
                    console.error("adminuser edit - " + error);
                    return interaction.reply({ content: "Une erreur est survenue lors de la modification de l'utilisateur dans la base de donnée !", ephemeral: true });
                }
            }


            /**
             * List all users in the database
             */
            case "list":
                // TODO: list all users in the database
                await interaction.reply({ content: "🚧〢Commande en cours de développement !", ephemeral: true });
                break;


            /**
             * Remove an user in the database
             */
            case "remove": {
                if (!confirm) return interaction.reply({ content: "Tu dois confirmer la suppression de l'utilisateur !", ephemeral: true });

                const newUser = await Users.findOne({ where: { user_id: user.id } });
                if (!newUser) return interaction.reply({ content: "Cet utilisateur n'existe pas dans la base de donnée !", ephemeral: true });

                try {
                    await newUser.destroy();
                    return interaction.reply({ content: "L'utilisateur a bien été supprimé de la base de donnée !", ephemeral: true });
                } catch (error) {
                    console.error("adminuser remove - " + error);
                    return interaction.reply({ content: "Une erreur est survenue lors de la suppression de l'utilisateur !", ephemeral: true });
                }
            }

            default:
                return interaction.reply("Erreur lors de l'exécution de la commande !");
        }
    },
};
