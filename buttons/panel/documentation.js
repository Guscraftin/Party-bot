module.exports = {
    data: {
        name: "documentation",
    },
    async execute(interaction) {
        return interaction.reply({
            content: "Voici le bouton pour avoir un embed avec un select menu (orga, invite, conctact via DM) !",
            ephemeral: true,
        });
    },
};