module.exports = {
    data: {
        name: "documentation",
    },
    async execute(interaction) {
        // Voici le bouton pour avoir un embed avec un select menu (orga, invite, conctact via DM)

        return interaction.reply({
            content: "Grâce à ce bouton, tu pourras accéder à toute la documentation qui explique toutes les fonctionnalités présentes sur ce serveur !",
            ephemeral: true,
        });
    },
};