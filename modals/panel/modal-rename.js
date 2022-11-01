module.exports = {
    data: {
        name: "modal-rename",
    },
    async execute(interaction) {
        const newName = interaction.fields.getTextInputValue("newName");

        await interaction.member.setNickname(newName, "Sur demande du membre");

        await interaction.reply({
            content: `Votre pseudo a bien été changé en \`${newName}\` !`,
            ephemeral: true,
        });
    },
};