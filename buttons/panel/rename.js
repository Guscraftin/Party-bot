module.exports = {
    data: {
        name: "rename",
    },
    async execute(interaction) {
        // C'est grâce à ce bouton que tu pourras accéder à un modal pour entrée ton nom

        return interaction.reply({
            content: "C'est ici qu'il faudra cliquer pour changer ton speudo !",
            ephemeral: true,
        });
    },
};