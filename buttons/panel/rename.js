module.exports = {
    data: {
        name: "rename",
    },
    async execute(interaction) {
        return interaction.reply({
            content: "C'est grâce à ce bouton que tu pourras accéder à un modal pour entrée ton nom !",
            ephemeral: true,
        });
    },
};