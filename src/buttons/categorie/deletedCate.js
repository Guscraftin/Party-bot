/**
 * Come from the command "categorie supprimer" in the file "src\command\invite\categorie.js".
 * Delete the category (party) of the organizer. (delete of the database in channelDelete.js)
 */

module.exports = {
    data: {
        name: "deletedCate",
    },
    async execute(interaction) {
        const cate = interaction.channel.parent;

        await cate.delete();
    },
};