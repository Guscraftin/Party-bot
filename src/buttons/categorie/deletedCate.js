module.exports = {
    data: {
        name: "deletedCate",
    },
    async execute(interaction) {
        const cate = interaction.channel.parent;

        await cate.delete();
    },
};