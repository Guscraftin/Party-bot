module.exports = {
    data: {
        name: "documentation",
    },
    async execute(interaction) {
        // Voici le bouton pour avoir un embed avec un select menu (orga, invite, conctact via DM)

        return interaction.reply({
            content: "Sur ce serveur, **tu peux organiser** facilement **une soirée** ou **un événement** en créant une catégorie avec le bouton vert ci dessus.\n\n" +
            "> **Pour les organisateurs :**\n" +
            "> -> Tu peux inviter des personnes et gérer les permissions pour tous les salons de ta catégorie dans les permissions de ta catégorie ou en utilisant les slash commandes du bots.\n" +
            "> -> Tu peux également verouiller ou déverouiller un salon pour que seul toi puisse parler ou non.\n\n" +
            "> **Pour les invités :**\n" +
            "> -> Tu peux quitter une catégorie à tout moment en taper dans un salon de la catégorie la commande : `/categorie quitter`\n\n" +
            "__PS :__ En cas de problème ou si tu as besoin d'aide, adresse toi à <@265785336175656970> en message privé.",
            ephemeral: true,
        });
    },
};