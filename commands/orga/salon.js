const { SlashCommandBuilder, PermissionsBitField, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { isOrgaCate } = require("../../utils/utilities");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("salon")
        .setDescription("Commande pour gérer les salons de ta soirée (sa catégorie) !")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("verrouiller")
                .setDescription("Pour que tes invités ne puissent pas parler dans ce salon."))
        .addSubcommand(subcommand =>
            subcommand.setName("déverrouiller")
                .setDescription("Pour permettre à tes invités de pourvoir parler dans ce salon."))
        .addSubcommand(subcommand =>
            subcommand.setName("créer")
                .setDescription("Pour créer un salon."))
        .addSubcommand(subcommand =>
            subcommand.setName("supprimer")
                .setDescription("Pour supprimer un salon.")),

    async execute(interaction) {
        const channelId = interaction.channelId;
        const channel = interaction.channel;
        const cate = channel.parent;
        const cateId = channel.parentId;

        // Create channel
        let newChannel;

        // Delete channel
        const confirmButton = new ButtonBuilder()
            .setCustomId("confirmDelete")
            .setLabel("Supprimer ce salon")
            .setStyle(ButtonStyle.Danger);

        if (!await isOrgaCate(cateId, interaction.member.id)) return interaction.reply({ content: "Tu dois être l'organisateur de cette soirée (de cette catégorie) pour pouvoir gérer les salons !\nSi tu es organisateur et que tu veux gérer tes salons, tape cette commande dans la catégorie de ta soirée.", ephemeral: true });

        switch (interaction.options.getSubcommand()) {
            case "verrouiller":
                try {
                    const bitPermissions = channel.permissionOverwrites.cache.get(interaction.guild.id).deny;
                    if (bitPermissions.has(PermissionsBitField.Flags.SendMessages)) {
                        return interaction.reply({ content: "Vos invités ne peuvent déjà plus écrire dans ce salon !", ephemeral: true });
                    } else {
                        channel.permissionOverwrites.edit(interaction.guild.id, {
                            SendMessages: false,
                        });
                        return interaction.reply({ content: "Vos invités ne peuvent désormais plus écrire dans ce salon !", ephemeral: true });
                    }

                } catch (error) {
                    console.error(`Erreur lors du verouillage de ce salon : <#${channelId}> !`);
                    console.error(error);
                    return interaction.reply({ content: "Votre interaction a rencontré un problème de permissions !", ephemeral: true });
                }

            case "déverrouiller":
                try {
                    const bitPermissions = channel.permissionOverwrites.cache.get(interaction.guild.id).deny;
                    if (!bitPermissions.has(PermissionsBitField.Flags.SendMessages)) {
                        return interaction.reply({ content: "Vos invités peuvent déjà écrire dans ce salon !", ephemeral: true });
                    } else {
                        channel.lockPermissions().catch(console.error);
                        return interaction.reply({ content: "Vos invités peuvent désormais écrire dans ce salon !", ephemeral: true });
                    }

                } catch (error) {
                    console.error(`Erreur lors du verouillage de ce salon : <#${channelId}> !`);
                    console.error(error);
                    return interaction.reply({ content: "Votre interaction a rencontré un problème de permissions !", ephemeral: true });
                }

            case "créer":
                try {
                    newChannel = await cate.children.create({
                        name: "nouveau",
                        type: ChannelType.GuildText,
                    });

                    return interaction.reply({ content: `Le salon <#${newChannel.id}> a bien été créé !`, ephemeral: true });

                } catch (error) {
                    console.error("Erreur lors de la création d'un salon !");
                    console.error(error);
                    return interaction.reply({ content: "Votre interaction a rencontré un problème de permissions !", ephemeral: true });
                }

            case "supprimer":
                try {
                    return interaction.reply({
                        content: `Es-tu sûr de vouloir supprimer ce salon ? (<#${channelId}>)\n\nSi c'est une erreur, rejete ce message pour éviter de cliquer sur le bouton rouge de suppression.`,
                        ephemeral: true,
                        components: [new ActionRowBuilder().addComponents(confirmButton)],
                    });

                } catch (error) {
                    console.error("Erreur lors de la suppression d'un salon !");
                    console.error(error);
                    return interaction.reply({ content: "Votre interaction a rencontré un problème de permissions !", ephemeral: true });
                }

            default:
                return interaction.reply({ content: "Votre interaction a recontré des problèmes, contacter l'administrateur !", ephemeral: true });
        }
    },
};
