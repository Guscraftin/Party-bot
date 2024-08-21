const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../dbObjects");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("salon")
        .setDescription("Commande pour gérer les salons de ta fête (ta catégorie) !")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("verrouiller")
                .setDescription("🎊〢Pour que tes invités ne puissent pas parler dans ce salon."))
        .addSubcommand(subcommand =>
            subcommand.setName("déverrouiller")
                .setDescription("🎊〢Pour permettre à tes invités de pourvoir parler dans ce salon."))
        .addSubcommand(subcommand =>
            subcommand.setName("créer")
                .setDescription("🎊〢Pour créer un nouveau salon."))
        .addSubcommand(subcommand =>
            subcommand.setName("supprimer")
                .setDescription("🎊〢Pour supprimer ce salon.")),

    async execute(interaction) {
        const channelId = interaction.channelId;
        const channel = interaction.channel;
        const cateId = channel.parentId;
        const cate = channel.parent;

        const party = await Party.findOne({ where: { category_id: cateId } });
        if (!party || (party.organizer_id !== interaction.member.id && !interaction.member.permissions.has(PermissionFlagsBits.Administrator) && !party.organizer_list_id.includes(interaction.member.id))) {
            return interaction.reply({
                content: "Tu dois être l'organisateur de cette fête (de cette catégorie) pour pouvoir gérer les invités !" +
                "\nSi tu es organisateur et que tu veux gérer tes invités, tape cette commande dans la catégorie de ta fête.",
                ephemeral: true,
            });
        }

        switch (interaction.options.getSubcommand()) {
            case "verrouiller":
                try {
                    const bitPermissions = channel.permissionOverwrites.cache.get(interaction.guild.id).deny;
                    if (bitPermissions.has(PermissionFlagsBits.SendMessages)) {
                        return interaction.reply({ content: "Vos invités ne peuvent déjà plus écrire dans ce salon !", ephemeral: true });
                    } else {
                        channel.permissionOverwrites.edit(interaction.guild.id, {
                            SendMessages: false,
                        });

                        try {
                            const listLockedChannel = party.channels_locked_id;
                            listLockedChannel.push(channelId);
                            await party.update({ channels_locked_id: listLockedChannel });
                        } catch (error) {
                            console.error("salon verrouiller - " + error);
                            return interaction.reply({ content: `Erreur lors de l'ajout du salon <#${channelId}> dans la liste des salons verouillés !`, ephemeral: true });
                        }

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
                    if (!bitPermissions.has(PermissionFlagsBits.SendMessages)) {
                        return interaction.reply({ content: "Vos invités peuvent déjà écrire dans ce salon !", ephemeral: true });
                    } else {
                        try {
                            const listLockedChannel = party.channels_locked_id;
                            const index = listLockedChannel.indexOf(channelId);
                            if (index > -1) {
                                listLockedChannel.splice(index, 1);
                                await party.update({ channels_locked_id: listLockedChannel });
                            }
                        } catch (error) {
                            console.error("salon déverrouiller - " + error);
                            return interaction.reply({ content: `Erreur lors de la suppression du salon <#${channelId}> dans la liste des salons verouillés !`, ephemeral: true });
                        }

                        await channel.lockPermissions().catch(console.error);
                        return interaction.reply({ content: "Vos invités peuvent désormais écrire dans ce salon !", ephemeral: true });
                    }

                } catch (error) {
                    console.error(`Erreur lors du verouillage de ce salon : <#${channelId}> !`);
                    console.error(error);
                    return interaction.reply({ content: "Votre interaction a rencontré un problème de permissions !", ephemeral: true });
                }

            case "créer":
                try {
                    const newChannel = await cate.children.create({
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
                    const confirmButton = new ButtonBuilder()
                        .setCustomId("confirmDelete")
                        .setLabel("Supprimer ce salon")
                        .setStyle(ButtonStyle.Danger);

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
