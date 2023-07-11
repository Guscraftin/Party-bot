const { Events } = require("discord.js");
const { channelPanelId } = require(process.env.CONST);
const { Party } = require("../../dbObjects");
const { syncParty } = require("../../functions");
const cron = require("cron");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // Set the client user's activity
        await client.user.setPresence({ activities: [{ name: "organiser vos soirées !", type: 0 }], status: "online" });

        // Sync the database
        await Party.sync({ alter: true });

        // Sync the server with the database
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        if (guild) {
            const channelFetch = await guild.channels.fetch();
            await Promise.all(channelFetch.map(channel => {
                syncParty(guild, channel);
            }));
        }

        // Set the cron jobs
        new cron.CronJob("0 5 * * *", () => syncParties(client), null, true, "Europe/Paris");
        new cron.CronJob("00 00 21 1,7,14,20,26 * *", () => sendDMJoin(client), null, true, "Europe/Paris");


        // Set a message when the bot is ready
        console.log(`Ready! Logged in as ${client.user.username}`);
    },
};

/**
 * Sync the server with the database + Remove the old parties
 * @param {import(Discord.js).client} client
 * @returns void
 */
async function syncParties(client) {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    if (guild) {
        const channelFetch = await guild.channels.fetch();
        await Promise.all(channelFetch.map(channel => {
            syncParty(guild, channel);
        }));
    }
}


/**
 * Send a DM to all the members who are not on the server
 * @param {import(Discord.js).client} client
 * @returns void
 */
async function sendDMJoin(client) {
    const blacklistMP = ["376493881854001152"];
    // Honorin

    const guildParty = await client.guilds.fetch(process.env.GUILD_ID);
    const channelPanel = await guildParty.channels.fetch(channelPanelId);
    const inviteURL = await guildParty.invites.create(channelPanel, { maxAge: 0, maxUses: 0, reason: "Invite des membres qui sont sur un autre serveur." });

    await client.guilds.fetch().then(async function(guilds) {
        await guilds.each(async function(partGuild) {
            await partGuild.fetch().then(async function(guild1) {
                await guild1.members.fetch().then(async function(members) {
                    await members.each(async function(member) {
                        try {
                            if (await guildParty.members.fetch().then(membre => !membre.has(member.id) && !member.user.bot) && blacklistMP.find(userId => userId === member.id) === undefined) {
                                try {
                                    member.send(`👋 Salut ${member.username} !\n\n` +
                                    `> Je viens te voir car __tu n'es toujours pas__ sur le serveur discord **\`${guildParty.name}\`**.\n` +
                                    "> Ce serveur **regroupe tous les événements organisés par les personnes présentes sur les même serveurs que toi** !\n" +
                                    `> Vient donc les rejoindre grâce à cette invitation ${inviteURL} afin que toi aussi tu puisses organiser tes soirées et être invité 🎉 !`);
                                    console.log(`Envoie d'une invite à ${member.displayName}`);
                                } catch (error) {
                                    console.log(`Impossible d'envoyer une invitation à ${member.displayName}`);
                                }
                            }
                        } catch (error) {
                            console.log(`Impossible de vérifier si ${member.displayName} est sur le serveur`);
                        }
                    });
                });
            });
        });
    });
}