const { Collection, SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../dbObjects");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Commande pour gérer les invités dans sa soirée (sa catégorie) !")
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
        if (member === interaction.member) return interaction.reply({ content: "Vous ne pouvez pas gérer votre invitation !", ephemeral: true });
        if (member.user.bot) return interaction.reply({ content: "Vous ne pouvez pas gérer l'invitation d'un bot discord à votre soirée !", ephemeral: true });

        const party = await Party.findOne({ where: { category_id: cateId } });
        if (!party || !party.organizer_list_id.includes(interaction.member.id) || !party.organizer_id === interaction.member.id) {
            return interaction.reply({
                content: "Tu dois être l'organisateur de cette soirée (de cette catégorie) pour pouvoir gérer les invités !" +
                "\nSi tu es organisateur et que tu veux gérer tes invités, tape cette commande dans la catégorie de ta soirée.",
                ephemeral: true,
            });
        }

        let withoutOrgaChannel;
        switch (interaction.options.getSubcommand()) {
            /**
             * Add a member to the party as a guest
             */
            case "ajouter":
                if (party.guest_list_id.includes(member.id)) return interaction.reply({ content: `${member} est déjà sur votre liste d'invités à votre soirée !`, ephemeral: true });

                try {
                    const listGuest = party.guest_list_id;
                    listGuest.push(member.id);
                    await party.update({ guest_list_id: listGuest });
                } catch (error) {
                    console.error("invite add db - " + error);
                    return interaction.reply({ content: "Une erreur est survenue lors de l'ajout de l'invité à votre soirée !", ephemeral: true });
                }

                withoutOrgaChannel = await interaction.guild.channels.fetch(await party.channel_without_organizer);
                if (withoutOrgaChannel && !(withoutOrgaChannel instanceof Collection)) await withoutOrgaChannel.permissionOverwrites.create(member, { ViewChannel: true });

                await channel.parent.permissionOverwrites.create(member, { ViewChannel: true });

                return interaction.reply({ content: `${member} a bien été ajouté sur votre liste d'invités pour votre soirée !`, ephemeral: true });

            /**
             * Remove a member from the party as a guest
             */
            case "retirer":
                if (!party.guest_list_id.includes(member.id)) return interaction.reply({ content: `${member} n'est déjà pas sur votre liste d'invités à votre soirée !`, ephemeral: true });

                if (party.organizer_list_id.includes(member.id)) return interaction.reply({ content: `${member} est dans votre liste d'organisateur pour votre soirée ! Vous ne pouvez pas le retirer de votre liste d'invités !\nSi vous souhaitez le retirer de votre soirée, utilisez la commande \`/orga retirer\` puis refaite cette commande.`, ephemeral: true });

                withoutOrgaChannel = await interaction.guild.channels.fetch(party.channel_without_organizer);
                if (withoutOrgaChannel && !(withoutOrgaChannel instanceof Collection)) await withoutOrgaChannel.permissionOverwrites.delete(member, `Par la volonté de l'organisateur (${member.id}) !`);

                await channel.parent.permissionOverwrites.delete(member, `Par la volonté de l'organisateur (${member.id}) !`);

                try {
                    const listGuest = party.guest_list_id;
                    const index = listGuest.indexOf(member.id);
                    if (index > -1) {
                        listGuest.splice(index, 1);
                        await party.update({ guest_list_id: listGuest });
                    }
                } catch (error) {
                    console.error("invite remove db - " + error);
                    return interaction.reply({ content: "Une erreur est survenue lors de la suppression de l'invité à votre soirée !", ephemeral: true });
                }

                return interaction.reply({ content: `${member} a bien été retiré de votre liste d'invités pour votre soirée !`, ephemeral: true });
        }
        return interaction.reply({ content: "Votre interaction a rencontré un problème !", ephemeral: true });
    },
};
