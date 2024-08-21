const { SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../dbObjects");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("message")
        .setDescription("👤〢Pour gérer les messages d'un salon !")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("épingler")
                .setDescription("👤〢Pour épingler un message dans ce salon.")
                .addStringOption(option =>
                    option.setName("message")
                        .setDescription("Le message à épingler.")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("désépingler")
                .setDescription("👤〢Pour désépingler un message dans ce salon.")
                .addStringOption(option =>
                    option.setName("message")
                        .setDescription("Le message à désépingler.")
                        .setRequired(true))),

    async execute(interaction) {
        const channel = interaction.channel;
        const messageId = interaction.options.getString("message");

        // Catch the exception of the permission
        const party = await Party.findOne({ where: { category_id: channel.parentId } });
        if (!party) return interaction.reply({ content: "Cette catégorie n'est pas une fête !", ephemeral: true });

        if (party.organizer_id !== interaction.member.id && !party.organizer_list_id.includes(interaction.member.id)) {
            if (channel.id !== party.channel_without_organizer) return interaction.reply({ content: `Vous pouvez uniquement utiliser cette commande dans <#${party.channel_without_organizer}>.`, ephemeral: true });
        }

        // Catch the exception of the message
        const onlyNumber = /^\d+$/;
        if (!onlyNumber.test(messageId)) return interaction.reply({ content: "L'id doit être l'identifiant du message à épingler.", ephemeral: true });

        const message = await channel.messages.fetch(messageId).catch(() => null);
        const messagesFetch = await channel.messages.fetchPinned().catch(() => null);
        if (!message || !messagesFetch) return interaction.reply({ content: "Ce message n'existe pas dans ce salon !", ephemeral: true });
        const isMessagePinned = messagesFetch.some(m => m.id === messageId);


        // Run the command
        switch (interaction.options.getSubcommand()) {
            /**
             * Pin a message
             */
            case "épingler":
                if (isMessagePinned) return interaction.reply({ content: "Ce message est déjà épinglé !", ephemeral: true });
                await message.pin();
                return interaction.reply({ content: `${interaction.member} a épinglé un message.` });


            /**
             * Unpin a message
             */
            case "désépingler":
                if (!isMessagePinned) return interaction.reply({ content: "Ce message n'est pas épinglé !", ephemeral: true });
                await message.unpin();
                return interaction.reply({ content: `${interaction.member} a désépinglé ce message ${message.url}.` });


            default:
                return interaction.reply({ content: "Votre commande n'existe pas !", ephemeral: true });
        }
    },
};
