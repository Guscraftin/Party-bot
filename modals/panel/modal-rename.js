const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { guild, adminPseudoLogId, adminPseudoLogIdTest } = require("../../constVar.json");

module.exports = {
    data: {
        name: "modal-rename",
    },
    async execute(interaction) {
        const newName = interaction.fields.getTextInputValue("newName");

        if (interaction.member.nickname === null) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL() })
                .setColor("#5193f8")
                .setDescription(`**${interaction.member} a changé son speudo !**\n`)
                .addFields(
                    { name: "Ancien pseudo :", value: interaction.member.user.username, inline: true },
                    { name: "Pseudo actuel :", value: newName, inline: true },
                )
                .setFooter({ text: `Id membre : ${interaction.member.user.id}` });

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("valider-rename")
                        .setEmoji("✏️")
                        .setLabel("Valider")
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId("invalider-rename")
                        .setEmoji("⛔")
                        .setLabel("Invalider")
                        .setStyle(ButtonStyle.Danger),
                );

            let pseudoLogChannel;
            if (interaction.guildId === guild) {
                pseudoLogChannel = interaction.client.channels.cache.get(adminPseudoLogId);
            } else {
                pseudoLogChannel = interaction.client.channels.cache.get(adminPseudoLogIdTest);
            }

            await interaction.member.setNickname(newName, "Sur demande du membre");
            await pseudoLogChannel.send({ embeds: [embed], components: [buttons] });

            await interaction.reply({
                content: "Votre pseudo a bien été changé !",
                ephemeral: true,
            });

        } else if (interaction.member.nickname === newName) {
            await interaction.reply({
                content: `Le pseudo demandé est déjà celui que vous avez actuellement soit \`${interaction.member.nickname}\` !`,
                ephemeral: true,
            });

        } else {
            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL() })
                .setColor("#5193f8")
                .setDescription(`**${interaction.member} veut changer son speudo !**\n`)
                .addFields(
                    { name: "Pseudo actuel :", value: interaction.member.nickname, inline: true },
                    { name: "Pseudo souhaité :", value: newName, inline: true },
                )
                .setFooter({ text: `Id membre : ${interaction.member.user.id}` });

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("accepter-rename")
                        .setEmoji("✏️")
                        .setLabel("Accepter")
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId("refuser-rename")
                        .setEmoji("⛔")
                        .setLabel("Refuser")
                        .setStyle(ButtonStyle.Danger),
                );

            let pseudoLogChannel;
            if (interaction.guildId === guild) {
                pseudoLogChannel = interaction.client.channels.cache.get(adminPseudoLogId);
            } else {
                pseudoLogChannel = interaction.client.channels.cache.get(adminPseudoLogIdTest);
            }

            await pseudoLogChannel.send({ embeds: [embed], components: [buttons] });

            await interaction.reply({
                content: "Votre demande pour changer de speudo à bien été envoyé pour traitement.\n" +
                "Vous recevrez le résultat de votre demande en MP (pensez à les autoriser).",
                ephemeral: true,
            });
        }
    },
};