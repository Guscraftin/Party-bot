const { ChannelType, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { syncParty } = require("../../functions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("syncdb")
        .setDescription("🚧〢Commande pour synchroniser la base de données avec le serveur !")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

    async execute(interaction) {
        const categoriesFetch = await interaction.guild.channels.fetch();
        const categories = await categoriesFetch.filter(channel => channel.type === ChannelType.GuildCategory);

        let numberSync = 0;
        let numberNotSync = -1; // -1 and not 0 because the admin category is not a party category

        await Promise.all(categories.map(async category => {
            const party = await syncParty(interaction.guild, category.id);
            if (party) numberSync++;
            else numberNotSync++;
        }));

        return interaction.reply({
            content: `**Synchronisation terminée !**\n**\`${numberSync}\`** soirées synchronisées.\n**\`${numberNotSync}\`** soirées non synchronisées.`,
            ephemeral: true,
        });
    },
};