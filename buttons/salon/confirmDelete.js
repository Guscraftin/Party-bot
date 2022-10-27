module.exports = {
    data: {
        name: "confirmDelete",
    },
    async execute(interaction) {
        await interaction.channel.delete("Sur demande de l'organisateur !");

        return interaction.reply({
            content: "Le salon est bien en train de se faire supprimer !",
            ephemeral: true,
        });
    },
};