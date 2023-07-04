const { Events, PermissionsBitField } = require("discord.js");
const { isPanelOrga, isOrgaCate, resetInvite, isAddInvite } = require("../../_utils/utilities");

module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel) {
        // Exit for update DM
        if (newChannel.type === 1 || newChannel.type === 3) return;

        let cate;
        if (newChannel.type === 4) {
            cate = newChannel;
        } else if (newChannel.parent != null) {
            cate = newChannel.parent;
        }

        const listPermOld = oldChannel.permissionOverwrites.cache;
        const listPermNew = newChannel.permissionOverwrites.cache;

        // Modif perm caté
        if (newChannel.type === 4) { // Ajouter si modif les perms d'un salon ?
            // Si perms voir à everyone est changé
            if (listPermOld.get(newChannel.guild.id).allow.has(PermissionsBitField.Flags.ViewChannel)
            != listPermNew.get(newChannel.guild.id).allow.has(PermissionsBitField.Flags.ViewChannel)) {
                cate.children.cache.each(async function(channel) {
                    if (await isPanelOrga(cate.id, channel.id)) {
                        await channel.send("Attention, tu permet à tout le monde de voir ou de ne plus voir cette catégorie !\n" +
                        "La fonctionnalité qui permet de répendre les permissions dans ta catégorie n'est pas implémenter." +
                        "Tu vas devoir vérifier toi même toutes les permissions dans tes salons.");
                    }
                });
            }

            // Si ajoute ou retire un membre à la caté ou salon (propager -> salon lock + actu db)

            // Actu db
            await resetInvite(cate.id);
            await cate.permissionOverwrites.cache.each(async function(perm) {
                if (perm.type === 1) {
                    if (!await isOrgaCate(cate.id, perm.id) && perm.id !== process.env.CLIENT_id) {
                        if (await perm.allow.has(PermissionsBitField.Flags.ViewChannel)) {
                            await isAddInvite(cate.id, perm.id);
                        }
                    }
                }
            });

            // Propage change (pour les salons lock, on les resyncro avec la cate et on les relock)
            await cate.children.cache.each(async function(channel1) {
                if (!channel1.permissionsLocked && !await isPanelOrga(cate.id, channel1.id)) {
                    await channel1.lockPermissions();
                    await channel1.permissionOverwrites.edit(newChannel.guild.id, {
                        SendMessages: false,
                    });
                }
            });
        }
    },
};
