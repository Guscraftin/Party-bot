const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

/**
 * Come from the button "Documentation" in the file "src\buttons\panel\documentation.js".
 */

module.exports = {
    data: {
        name: "menu-docs",
    },
    async execute(interaction) {
        const reason = interaction.values[0];


        let content;
        const listOptions = [];
        /**
         * Option: Organisateur principal
         */
        if (reason === "Organisateur principal") {
            content = `# Organisateur principal
Vous avez accès à toutes les commandes de <@${process.env.CLIENT_ID}>. De ce fait, toutes les explications dans les différentes parties de la documentation vous sont destinées.

## Informations :
En tant qu'organisateur principal de votre fête, vous avez les permissions pour envoyer des messages dans les salons verrouillés, mentionner tout le monde, gérer les messages épinglés et les salons de votre fête.

## Voici les commandes que vous pouvez utiliser en tant qu'organisateur principal :
- 🎉 \`/categorie supprimer\` : Vous permet de supprimer votre fête. (OU, vous pouvez également supprimer votre catégorie.)
- 🎉 \`/date\` : Pour changer la date de votre fête.
- 🎉 \`/orga ajouter\` : Ajoutez une personne à votre liste des organisateurs. (OU, d'ajouter dans les permissions de la catégorie de votre fête, la permission d'envoyer des messages aux personnes que vous souhaitez ajouter en tant qu'organisateur.)
- 🎉 \`/orga retirer\` : Retirez une personne de votre liste des organisateurs. (OU, de retirer dans les permissions de la catégorie de votre fête, la permission d'envoyer des messages aux personnes que vous souhaitez retirer de votre liste des organisateurs.)

En cas de difficulté, vous pouvez envoyer un message privé à <@265785336175656970>.`;
            listOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setDefault(true)
                    .setLabel("Organisateur principal")
                    .setValue("Organisateur principal"),
            );
        } else {
            listOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Organisateur principal")
                    .setValue("Organisateur principal"),
            );
        }


        /**
         * Option: Liste des organisateurs
         */
        if (reason === "Liste des organisateurs") {
            content = `# Liste des organisateurs
Vous avez accès aux commandes de <@${process.env.CLIENT_ID}> ayant pour symbole 🎊 et 👤.

## Informations :
En tant que personne faisant partie de la liste des organisateurs, vous avez les permissions suivantes en plus des permissions en tant qu'invité : d'envoyer des messages dans les salons verrouillés, de mentionner tout le monde, de gérer les messages épinglés et les salons.

## Voici les commandes que vous pouvez utiliser en tant qu'organisateur :
- 🎊 \`/invite ajouter\` : Ajoutez une personne à la liste d'invités de la fête. (OU, ajoutez dans les permissions de la catégorie de la fête, la permission de voir les salons aux personnes que vous souhaitez ajouter en tant qu'invité.)
- 🎊 \`/invite retirer\` : Retirez une personne de la liste d'invités de la fête. (OU, retirez dans les permissions de la catégorie de la fête, la permission de voir les salons aux personnes que vous souhaitez retirer de la liste d'invités.)
- 🎊 \`/salon verrouiller\` : Retirer la permission d'envoyer des messages aux invités qui ne font pas partie de la liste des organisateurs. [NE PAS MODIFIER LES PERMISSIONS DES SALONS SANS PASSER PAR LES COMMANDES DU BOT]
- 🎊 \`/salon déverrouiller\` : Mettre la permission d'envoyer des messages aux invités. [NE PAS MODIFIER LES PERMISSIONS DES SALONS SANS PASSER PAR LES COMMANDES DU BOT]
- 🎊 \`/salon créer\` : Créer un salon dans la catégorie de la fête.
- 🎊 \`/salon supprimer\` : Supprimer un salon dans la catégorie de la fête.

En cas de difficulté, vous pouvez envoyer un message privé à <@265785336175656970>.`;
            listOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setDefault(true)
                    .setLabel("Liste des organisateurs")
                    .setValue("Liste des organisateurs"),
            );
        } else {
            listOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Liste des organisateurs")
                    .setValue("Liste des organisateurs"),
            );
        }


        /**
         * Option: Liste des invités
         */
        if (reason === "Liste des invités") {
            content = `# Liste des invités
Vous avez accès qu'aux commandes de <@${process.env.CLIENT_ID}> ayant pour symbole 👤.

## Informations :
En tant qu'invité à une fête, vous pouvez quitter à tout moment une fête via une commande. Sachez que l'organisateur principal recevra une notification lors de votre départ.

## Voici les commandes que vous pouvez utiliser en tant qu'invité :
- 👤 \`/categorie quitter\` : Pour quitter une fête.
- 👤 \`/message épingler\` : Pour épingler un message dans le salon #sans-orga. (Utilisable pour les organisateurs dans tous les salons.)
- 👤 \`/message désépingler\` : Pour désépingler un message dans le salon #sans-orga. (Utilisable pour les organisateurs dans tous les salons.)

En cas de difficulté, vous pouvez envoyer un message privé à <@265785336175656970>.`;
            listOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setDefault(true)
                    .setLabel("Liste des invités")
                    .setValue("Liste des invités"),
            );
        } else {
            listOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Liste des invités")
                    .setValue("Liste des invités"),
            );
        }


        /**
         * Option: Tout le monde
         */
        if (reason === "Tout le monde") {
            content = `# Tout le monde
"Tout le monde" fait référence à l'endroit accessible à toutes les personnes présentes sur ce serveur Discord. Par conséquent, ce salon est exclusivement dédié à cet usage. Vous n'avez pas la possibilité d'utiliser des commandes spécifiques dans ce salon.
            
## Informations :
Vous avez à disposition dans ce salon un panel afin d'accéder à trois fonctionnalités.
- \`🎉・Créer une fête!\` : Pour créer votre propre fête. Il vous sera demandé la date de début et de fin de votre fête.
- \`✏️・Se renommer\` : Vous permet de vous renommer sur le serveur discord. Sachez que vous pouvez vous renommer autant de fois que vous le souhaitez du moment que votre pseudo commence par votre prénom. La première fois que vous effectuez une demande, un modérateur devra valider votre demande avant que vous puissiez vous renommer. Et les fois suivantes, votre demande sera automatiquement validée ou refusée. Tant que vous n'avez pas été renommé, vous recevrez un message privé de <@${process.env.CLIENT_ID}>. Même si votre pseudo discord est déjà votre prénom, vous devez effectuer cette demande afin d'éviter de recevoir les messages du bot.
- \`📰・Documentation\` : Vous permet d'accéder à cette documentation qui détaille toutes les commandes et systèmes mis en place sur ce serveur discord afin de vous simplifier la vie.

En cas de difficulté, vous pouvez envoyer un message privé à <@265785336175656970>.`;
            listOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setDefault(true)
                    .setLabel("Tout le monde")
                    .setValue("Tout le monde"),
            );
        } else {
            listOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Tout le monde")
                    .setValue("Tout le monde"),
            );
        }


        /**
         * Option: Menu principal
         */
        if (reason === "Menu principal") {
            content = `# Menu Principal

## Organisation de la documentation :
*Vous pouvez changer de page via la barre de sélection en bas de ce message.*
- \`Organisateur principal\` : Toutes les informations utiles pour l'organisateur principal.
- \`Liste des organisateurs\` : Toutes les informations utiles pour les organisateurs.
- \`Liste des invités\` : Toutes les informations utiles pour les invités.
- \`Tout le monde\` : Toutes les informations utiles pour tout le monde.
- \`Menu principal\` : Retour à ce menu principal.

## Organisation d'une fête :
- \`#orga-panel\` : Le salon uniquement accessible pour l'organisateur principal afin d'être averti quand un membre quitte sa fête ou quand un membre rejoint ou quitte le serveur.
- \`#orga-only\` : Le salon réservé aux organisateurs sans les invités.
- \`#sans-orga\` : Le salon réservé aux invités. L'organisateur principal et les organisateurs n'y ont pas accès.
- \`#discussion\` : Le salon basique où tous les invités à la fête peuvent discuter par défaut.
- \`#Date: ...\` : La date de la fête.

## Informations indispensables pour l'organisateur principal :
- Ne pas modifier les permissions des salons sans passer par les commandes du bot (sauf pour les permissions de la catégorie). Si vous modifiez les permissions d'un salon, le bot les resynchronisera avec la base de données et les permissions de la catégorie.
- Lors de la création d'une fête, invitez d'abord les organisateurs en les assignant comme organisateurs avec la commande adéquate avant d'inviter les invités. (Cela évite que les organisateurs aient accès au contenu du salon \`#sans-orga\`.)

En cas de difficulté ou de suggestions, vous pouvez envoyer un message privé à <@265785336175656970>.`;
            listOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setDefault(true)
                    .setLabel("Menu principal")
                    .setValue("Menu principal"),
            );
        } else {
            listOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Menu principal")
                    .setValue("Menu principal"),
            );
        }


        // Create the select menu
        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("menu-docs")
                    .setPlaceholder("Sélectionnez une partie de la doc...")
                    .addOptions(listOptions),
            );

        return interaction.reply({
            content: content,
            components: [selectMenu],
            ephemeral: true,
        });
    },
};