const { SlashCommandBuilder } = require("discord.js");
const { Party } = require("../../dbObjects");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Commande pour gérer les invités dans sa soirée (sa catégorie) !")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("ajouter")
                .setDescription("🎉〢Pour ajouter un membre à sa soirée (sa catégorie).")
                .addUserOption(option => option.setName("membre").setDescription("Le membre à ajouter").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("retirer")
                .setDescription("🎉〢Pour retirer un membre à sa soirée (sa catégorie).")
                .addUserOption(option => option.setName("membre").setDescription("Le membre à retirer").setRequired(true))),

    async execute(interaction) {
        const channel = interaction.channel;
        const member = interaction.options.getMember("membre");
        const cateId = channel.parentId;

        // TODO: list of all organizer can use this command
        const party = await Party.findOne({ where: { category_id: cateId, organizer_id: interaction.member.id } });
        if (!party) {
            return interaction.reply({
                content: "Tu dois être l'organisateur de cette soirée (de cette catégorie) pour pouvoir gérer les invités !" +
                "\nSi tu es organisateur et que tu veux gérer tes invités, tape cette commande dans la catégorie de ta soirée.",
                ephemeral: true,
            });
        }

        if (member === interaction.member) return interaction.reply({ content: "Vous ne pouvez pas gérer votre invitation car vous êtes déjà l'organisateur de cette soirée !", ephemeral: true });
        if (member.user.bot) return interaction.reply({ content: "Vous ne pouvez pas gérer l'invitation d'un bot discord à votre soirée !", ephemeral: true });

        switch (interaction.options.getSubcommand()) {
            /**
             * Add a member to the party as a guest
             */
            case "ajouter":
                if (party.includes(member.id)) return interaction.reply({ content: `${member} est déjà sur votre liste d'invités à votre soirée !`, ephemeral: true });

                try {
                    const listGuest = party.guest_list_id;
                    listGuest.push(member.id);
                    await party.update({ guest_list_id: listGuest });
                } catch (error) {
                    console.error("invite add db - " + error);
                    return interaction.reply({ content: "Une erreur est survenue lors de l'ajout de l'invité à votre soirée !", ephemeral: true });
                }

                await channel.parent.permissionOverwrites.create(member, {
                    ViewChannel: true,
                });
                await channel.parent.children.cache.each(async function(channel1) {
                    if (channel1.id != party.panel_organizer_id && channel1.id != party.channel_organizer_only) {
                        await channel1.permissionOverwrites.create(member, {
                            ViewChannel: true,
                        });
                    }
                });
                return interaction.reply({ content: `${member} a bien été ajouté sur votre liste d'invités pour votre soirée !`, ephemeral: true });

            /**
             * Remove a member from the party as a guest
             */
            case "retirer":
                await channel.parent.permissionOverwrites.delete(member, `Par la volonté de l'organisateur (${member.id}) !`);
                await channel.parent.children.cache.each(function(channel1) {
                    channel1.permissionOverwrites.delete(member);
                });

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
