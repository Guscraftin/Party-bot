const { Events } = require("discord.js");
const { isPanelOrga } = require("../utils/utilities");
const { adminCateId, adminCateIdTest, guild, guildTest } = require("../constVar");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (member.guild.id == guild || member.guild.id == guildTest) {
            try {
                await member.send(`👋 Bonjour ${member.user.username}, je suis \`Party Bot\`, le bot qui gère le serveur **${member.guild.name}**.\n` +
                "Je te contacte pour me présenter et pour te remercier d'avoir rejoint ce serveur.\n\n" +
                "> Sur celui-ci, tu pourras **organiser ta propre soirée ou ton propre événement** 🎉 !\n" +
                "> De plus, tu pourras facilement être invité aux soirées organisées sur le serveur.\n" +
                "> D'ailleurs, en rejoingnant ce serveur, tu diminues le risque d'être oublié dans la liste des invités à un événement.\n\n" +
                "**N'oublie pas de te renommer avec ton prénom** grâce au bouton sous le panel et **d'inviter tes amis** pour toi aussi organiser tes soirées sur ce serveur avec tout le monde 😉 !");
                // Ajouter en embed avec le lien vers le panel
            } catch (e) {
                console.error(e);
            }

            await member.guild.channels.fetch().then(async function(channels) {
                await channels.filter(channel => channel.parentId != null && channel.parentId != adminCateId && channel.parentId != adminCateIdTest).each(async function(channel) {
                    if (await isPanelOrga(channel.parentId, channel.id)) {
                        await channel.send(`**<@${member.id}> a rejoint le serveur !**\n` +
                        `Si tu souhaites l'inviter à ta soirée, tu peux désormais le faire avec la commande \`/invite ajouter @${member.user.tag}\` !`);
                    }
                });
            });
        }
    },
};