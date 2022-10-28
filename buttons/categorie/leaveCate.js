const { isRemoveInvite } = require("../../utils/utilities");

module.exports = {
    data: {
        name: "leaveCate",
    },
    async execute(interaction) {
        const channel = interaction.channel;
        const cateId = channel.parentId;
        const membre = interaction.member;

        // Parcourir la liste des membres et comparé si c'est l'orga si oui on vérif si mp possible et on envoie
        // console.log(interaction.guild.members.cache);
        console.log(interaction.guild.members.fetch()
            .then(console.log)
            .catch(console.error));

        // client.users.send('id', 'content');

        if (await isRemoveInvite(cateId, membre.id)) {
            await channel.parent.permissionOverwrites.delete(membre, `Par la volonté de l'invité (${membre.id}) !`);
            await channel.parent.children.cache.each(function(channel1) {
                channel1.permissionOverwrites.delete(membre);
            });
        } else {
            return interaction.reply({ content: `<@${membre.id}> n'a pas pu être retiré de cette soirée !`, ephemeral: true });
        }
    },
};