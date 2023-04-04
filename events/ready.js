const { Events } = require("discord.js");
const { guild, channelPanelId } = require("../constVar.json");
const cron = require("cron");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setPresence({ activities: [{ name: "organiser vos soirées !", type: 0 }], status: "online" });
        console.log(`Ready! Logged in as ${client.user.tag}`);


        const MPInvite = new cron.CronJob("00 00 21 1,7,14,20,26 * *", async function() {
            const blacklistMP = ["376493881854001152"];
            // Honorin

            let guildParty = 0;
            await client.guilds.fetch(guild).then(function(guild1) {
                guildParty = guild1;
            });

            let channelPanel;
            await guildParty.channels.fetch(channelPanelId).then(channel => channelPanel = channel);
            let inviteURL;
            await guildParty.invites.create(channelPanel, { maxAge: 0, maxUses: 0, reason: "Invite des membres qui sont sur un autre serveur." }).then(function(invite) {
                inviteURL = invite.url;
            });

            await client.guilds.fetch().then(async function(guilds) {
                await guilds.each(async function(partGuild) {
                    if (partGuild.id !== guild) {
                        await partGuild.fetch().then(async function(guild1) {
                            await guild1.members.fetch().then(async function(members) {
                                await members.each(async function(member) {
                                    if (await guildParty.members.fetch().then(membre => !membre.has(member.id) && !member.user.bot) && blacklistMP.find(userId => userId === member.id) === undefined) {
                                        try {
                                            member.send(`👋 Salut ${member.user.username} !\n\n` +
                                            `> Je viens te voir car __tu n'es toujours pas__ sur le serveur discord **\`${guildParty.name}\`**.\n` +
                                            "> Ce serveur **regroupe tous les événements organisés par les personnes présentes sur les même serveurs que toi** !\n" +
                                            `> Vient donc les rejoindre grâce à cette invitation ${inviteURL} afin que toi aussi tu puisses organiser tes soirées et être invité 🎉 !`);
                                            console.log(`Envoie d'une invite à ${member.user.tag}`);
                                        } catch (error) {
                                            console.log(`Impossible d'envoyer une invitation à ${member.user.tag}`);
                                        }
                                    }
                                });
                            });
                        });
                    };
                });
            });
        });

        MPInvite.start();
    },
};
