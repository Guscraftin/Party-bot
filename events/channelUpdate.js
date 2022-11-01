const { Events, PermissionsBitField } = require("discord.js");
const { isPanelOrga } = require("../utils/utilities");

module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel) {
        // Exit for update DM
        if (newChannel.type === 1 || newChannel.type === 3) return;

        let cate;
        let isInCate;
        if (newChannel.type === 4) {
            cate = newChannel;
            isInCate = true;
        } else if (newChannel.parent == null) {
            isInCate = false;
        } else {
            cate = newChannel.parent;
            isInCate = true;
        }

        // Si perms voir à everyone est changé
        if (oldChannel.permissionOverwrites.cache.get(newChannel.guild.id).allow.has(PermissionsBitField.Flags.ViewChannel)
        != newChannel.permissionOverwrites.cache.get(newChannel.guild.id).allow.has(PermissionsBitField.Flags.ViewChannel)) {
            if (newChannel.type === 4) { // Ajouter si modif les perms d'un salon ?
                cate.children.cache.each(async function(channel) {
                    if (await isPanelOrga(cate.id, channel.id)) {
                        await channel.send("Attention, tu permet à tout le monde de voir ou de ne plus voir cette catégorie !\n" +
                        "La fonctionnalité qui permet de répendre les permissions dans ta catégorie n'est pas implémenter." +
                        "Tu vas devoir vérifier toi même toutes les permissions dans tes salons.");
                    }
                });
            }
        }


        // Si ajoute ou retire un membre à la caté ou salon (propager + actu db)
        // Attention dans un même push peut y avor plusieurs changements comme ajout + retrait pers et change perms
        if (isInCate) {
            console.log("oui c'est dans une caté");
        } else {
            console.log("Le salon modif n'est pas dans cate");
        }
    },
};
