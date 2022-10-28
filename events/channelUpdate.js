const { Events, PermissionsBitField } = require("discord.js");

module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel) {
        // Exit for update DM
        if (newChannel.type === 1 || newChannel.type === 3) return;

        let cate;
        let isCate;
        if (newChannel.type === 4) {
            cate = newChannel;
            isCate = true;
        } else {
            cate = newChannel.parent;
            isCate = true;
        }

        // Si perms voir à everyone est changé
        if (oldChannel.permissionOverwrites.cache.get(newChannel.guild.id).allow.has(PermissionsBitField.Flags.ViewChannel)
        != newChannel.permissionOverwrites.cache.get(newChannel.guild.id).allow.has(PermissionsBitField.Flags.ViewChannel)) {
            console.log("Les permissions du rôle everyone ont changé (tout le monde [peut/ne peut pas] voir le contenue du salon) !");
        }


        // Si ajoute ou retire un membre à la caté ou salon (propager + actu db)
        // Attention dans un même push peut y avor plusieurs changements comme ajout + retrait pers et change perms
        if (isCate) {
            console.log("oui c'est une caté");
        } else {
            console.log(cate);
        }
    },
};
