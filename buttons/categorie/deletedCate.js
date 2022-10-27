const { deleteCate } = require("../../utils/utilities");

module.exports = {
    data: {
        name: "deletedCate",
    },
    async execute(interaction) {
        const cate = interaction.channel.parent;

        await cate.children.cache.each(channel => channel.delete());
        await deleteCate(cate.id);
        await cate.delete();

        return interaction.reply({
            content: "Votre soirée (catégorie) est bien en train de se faire supprimer dans son intégralité !",
            ephemeral: true,
        });
    },
};