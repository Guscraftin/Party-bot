const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { syncParty } = require("../../functions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("syncdb")
        .setDescription("🚧〢Commande pour synchroniser la base de données et le serveur !")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply("La syncronisation a été lancé !");

        const channelFetch = await interaction.guild.channels.fetch();
        await Promise.all(channelFetch.map(channel => {
            syncParty(interaction.guild, channel);
        }));
    },
};