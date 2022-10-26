module.exports = {
    data: {
        name: "deleteCate",
    },
    async execute(interaction) {
        await interaction.reply({
            content: "Je suis un bouton fonctionnel pour quitter ou supprimer une caté !",
            ephemeral: true,
        });
    },
};