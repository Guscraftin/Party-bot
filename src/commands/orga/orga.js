const { Collection, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../dbObjects");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("orga")
        .setDescription("Commande pour gérer les organisateurs dans sa soirée (sa catégorie) !")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("ajouter")
                .setDescription("🎉〢Pour ajouter un membre à sa soirée (sa catégorie).")
                .addUserOption(option => option.setName("membre").setDescription("Le membre ou l'id du membre à ajouter").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("retirer")
                .setDescription("🎉〢Pour retirer un membre à sa soirée (sa catégorie).")
                .addUserOption(option => option.setName("membre").setDescription("Le membre ou l'id du membre à retirer").setRequired(true))),

    async execute(interaction) {
        const channel = interaction.channel;
        const member = interaction.options.getMember("membre");
        const cateId = channel.parentId;

        // Check the exception of the member
        if (!member) return interaction.reply({ content: "Ce membre n'est plus sur le serveur !", ephemeral: true });
        if (member === interaction.member) return interaction.reply({ content: "Vous êtes déjà l'organisateur de cette soirée !", ephemeral: true });
        if (member.user.bot) return interaction.reply({ content: "Vous ne pouvez pas mettre un bot discord en tant qu'organisateur de votre soirée !", ephemeral: true });

        const party = await Party.findOne({ where: { category_id: cateId } });
        if (!party || (party.organizer_id !== interaction.member.id && !interaction.member.permissions.has(PermissionFlagsBits.Administrator))) {
            return interaction.reply({
                content: "Tu dois être l'organisateur de cette soirée (de cette catégorie) pour pouvoir gérer les organisateurs !" +
                "\nSi tu es organisateur et que tu veux gérer tes organisateurs, tape cette commande dans la catégorie de ta soirée.",
                ephemeral: true,
            });
        }

        if (!party.guest_list_id.includes(member.id)) return interaction.reply({ content: `Vous devez d'abord ajouter ${member} en tant qu'invité à votre soirée avant de l'ajouter en tant qu'organisateur !`, ephemeral: true });


        let organizersOnlyChannel, withoutOrgaChannel;
        switch (interaction.options.getSubcommand()) {
            /**
             * Add a member to the party as a organizer
             */
            case "ajouter":
                if (party.organizer_list_id.includes(member.id)) return interaction.reply({ content: `${member} est déjà sur votre liste d'organisateur à votre soirée !`, ephemeral: true });

                try {
                    const listOrganizer = party.organizer_list_id;
                    listOrganizer.push(member.id);
                    await party.update({ organizer_list_id: listOrganizer });
                } catch (error) {
                    console.error("orga add db - " + error);
                    return interaction.reply({ content: "Une erreur est survenue lors de l'ajout de l'organisateur à votre soirée !", ephemeral: true });
                }

                withoutOrgaChannel = await interaction.guild.channels.fetch(await party.channel_without_organizer);
                if (withoutOrgaChannel && !(withoutOrgaChannel instanceof Collection)) await withoutOrgaChannel.permissionOverwrites.delete(member, `Par la volonté de l'organisateur (${member.id}) !`);

                organizersOnlyChannel = await interaction.guild.channels.fetch(await party.channel_organizer_only);
                if (organizersOnlyChannel && !(organizersOnlyChannel instanceof Collection)) await organizersOnlyChannel.permissionOverwrites.create(member, { ViewChannel: true });

                await channel.parent.permissionOverwrites.edit(member, { SendMessages: true });

                return interaction.reply({ content: `${member} a bien été ajouté sur votre liste d'organisateur pour votre soirée !`, ephemeral: true });

            /**
             * Remove a member from the party as a organizer
             */
            case "retirer":
                if (!party.organizer_list_id.includes(member.id)) return interaction.reply({ content: `${member} n'est déjà pas sur votre liste des organisateurs à ta soirée !`, ephemeral: true });

                withoutOrgaChannel = await interaction.guild.channels.fetch(await party.channel_without_organizer);
                if (withoutOrgaChannel && !(withoutOrgaChannel instanceof Collection)) await withoutOrgaChannel.permissionOverwrites.create(member, { ViewChannel: true });

                organizersOnlyChannel = await interaction.guild.channels.fetch(party.channel_organizer_only);
                if (organizersOnlyChannel && !(organizersOnlyChannel instanceof Collection)) await organizersOnlyChannel.permissionOverwrites.delete(member, `Par la volonté de l'organisateur (${member.id}) !`);

                await channel.parent.permissionOverwrites.edit(member, { SendMessages: null });

                try {
                    const listOrganizer = party.organizer_list_id;
                    const index = listOrganizer.indexOf(member.id);
                    if (index > -1) {
                        listOrganizer.splice(index, 1);
                        await party.update({ organizer_list_id: listOrganizer });
                    }
                } catch (error) {
                    console.error("orga remove db - " + error);
                    return interaction.reply({ content: "Une erreur est survenue lors de la suppression de l'organisateur à votre soirée !", ephemeral: true });
                }

                return interaction.reply({ content: `${member} a bien été retiré de votre liste d'organisateur pour votre soirée !`, ephemeral: true });
        }
        return interaction.reply({ content: "Votre interaction a rencontré un problème !", ephemeral: true });
    },
};
