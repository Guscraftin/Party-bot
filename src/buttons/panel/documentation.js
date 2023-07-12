const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

/**
 * Come from the button "Documentation" in the file "src\buttons\panel\panel.js".
 * Show the documentation of the bot.
 */

module.exports = {
    data: {
        name: "documentation",
    },
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("menu-docs")
                    .setPlaceholder("Sélectionnez une partie de la doc...")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Organisateur principal")
                            .setValue("Organisateur principal"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Liste des organisateurs")
                            .setValue("Liste des organisateurs"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Liste des invités")
                            .setValue("Liste des invités"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Tout le monde")
                            .setValue("Tout le monde"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Menu principal")
                            .setValue("Menu principal"),
                    ),
            );

        return interaction.reply({
            content: `# Menu Principal

## Organisation de la documentation :
*Vous pouvez changer de page via la barre de sélection en bas de ce message.*
- \`Organisateur principal\` : Toutes les informations utiles pour l'organisateur principal.
- \`Liste des organisateurs\` : Toutes les informations utiles pour les organisateurs.
- \`Liste des invités\` : Toutes les informations utiles pour les invités.
- \`Tout le monde\` : Toutes les informations utiles pour tout le monde.
- \`Menu principal\` : Retour à ce menu principal.

## Organisation d'une soirée :
- \`#orga-panel\` : Le salon uniquement accessible pour l'organisateur principal afin d'être averti quand un membre quitte sa fête ou quand un membre rejoint ou quitte le serveur.
- \`#orga-only\` : Le salon réservé aux organisateurs sans les invités.
- \`#sans-orga\` : Le salon réservé aux invités. L'organisateur principal et les organisateurs n'y ont pas accès.
- \`#discussion\` : Le salon basique où tous les invités à la fête peuvent discuter par défaut.
- \`#Date: ...\` : La date de la soirée.

## Informations indispensables pour l'organisateur principal :
- Ne pas modifier les permissions des salons sans passer par les commandes du bot (sauf pour les permissions de la catégorie). Si vous modifiez les permissions d'un salon, le bot les resynchronisera avec la base de données et les permissions de la catégorie.
- Lors de la création d'une soirée, invitez d'abord les organisateurs en les assignant comme organisateurs avec la commande adéquate avant d'inviter les invités. (Cela évite que les organisateurs aient accès au contenu du salon \`#sans-orga\`.)

En cas de difficulté ou de suggestions, vous pouvez envoyer un message privé à <@265785336175656970>.`,
            components: [selectMenu],
            ephemeral: true,
        });
    },
};