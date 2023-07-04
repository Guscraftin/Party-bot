module.exports = {
    data: {
        name: "confirmDelete",
    },
    async execute(interaction) {
        await interaction.channel.delete("Sur demande de l'organisateur !");
    },
};