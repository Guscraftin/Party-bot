
/**
 * Come from the button "Supprimer la soirée" in the file "src\buttons\salon\delete.js".
 * Delete a channel in a category (party) by the organizer.
 */

module.exports = {
    data: {
        name: "confirmDelete",
    },
    async execute(interaction) {
        await interaction.channel.delete("Sur demande de l'organisateur !");
        return interaction.reply({ content: "La soirée a bien été supprimé !", ephemeral: true });
    },
};