module.exports = {
    data: {
        name: "confirmDelete",
    },
    async execute(interaction) {
        const channelId = interaction.channelId;
        const channelPromise = interaction.client.channels.fetch(channelId);

        await channelPromise.then(function(channel) {
            channel.delete("Sur demande de l'organisateur !");
        });

        return await interaction.reply({
            content: `Le salon \`${interaction.channel.name}\` est bien en train de se faire supprimer !`,
            ephemeral: true,
        });
    },
};