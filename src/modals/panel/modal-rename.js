const { Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { adminPseudoLogId, color_basic } = require(process.env.CONST);

/**
 * Come from the button "Se renommer" in the file "src\commands\admin\panel.js".
 */

module.exports = {
    data: {
        name: "modal-rename",
    },
    async execute(interaction) {
        const newName = interaction.fields.getTextInputValue("newName");
        const newNamePart1 = newName.slice(1).split(" ");
        const newNameFormat = newName[0].toUpperCase() + newNamePart1[0].toLowerCase() + " " + newNamePart1.slice(1).join(" ");

        /**
         * If the member has the same nickname
         */
        if (interaction.member.nickname === newName) {
            return interaction.reply({
                content: `Le pseudo demandé est déjà celui que vous avez actuellement soit \`${interaction.member.nickname}\` !`,
                ephemeral: true,
            });
        }


        /**
         * If the member has already a nickname and the new nickname as the same first part of the old one
         */
        if (interaction.member.nickname !== null) {
            const newNameSplit = newNameFormat.split(" ");
            const nameSplit = interaction.member.nickname.split(" ");

            if (newNameSplit[0] == nameSplit[0]) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL() })
                    .setColor(color_basic)
                    .setDescription(`**${interaction.member} a changé son speudo !**\n`)
                    .addFields(
                        { name: "Ancien pseudo :", value: interaction.member.displayName, inline: true },
                        { name: "Pseudo actuel :", value: newName, inline: true },
                    )
                    .setFooter({ text: `Id membre : ${interaction.member.user.id}` });

                const pseudoLogChannel = await interaction.guild.channels.fetch(adminPseudoLogId);
                if (!pseudoLogChannel || pseudoLogChannel instanceof Collection) return interaction.reply({ content: "Votre demande n'a pas pu être correctement envoyée.", ephemeral: true });

                await interaction.member.setNickname(newName, "Sur demande du membre");
                await pseudoLogChannel.send({ embeds: [embed] });

                return interaction.reply({
                    content: "Votre pseudo a bien été changé !",
                    ephemeral: true,
                });
            // If the new nickname as not the same first part of the old one
            } else {
                return interaction.reply({
                    content: `Votre nouveau pseudo (\`${newName}\`) doit commencer par \`${nameSplit[0]} \` pour être changé.`,
                    ephemeral: true,
                });
            }


        /**
         * If the member as no nickname
         */
        } else {
            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL() })
                .setColor(color_basic)
                .setDescription(`**${interaction.member} veut changer son speudo !**\n`)
                .addFields(
                    { name: "Pseudo actuel :", value: interaction.member.displayName, inline: true },
                    { name: "Pseudo souhaité :", value: newNameFormat, inline: true },
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

            const pseudoLogChannel = await interaction.guild.channels.fetch(adminPseudoLogId);
            if (!pseudoLogChannel || pseudoLogChannel instanceof Collection) return interaction.reply({ content: "Votre demande n'a pas pu être correctement envoyée.", ephemeral: true });

            await pseudoLogChannel.send({ embeds: [embed], components: [buttons] });

            return interaction.reply({
                content: "Votre demande pour changer de speudo à bien été envoyé pour traitement.\n" +
                "Vous recevrez le résultat de votre demande en MP (pensez à les autoriser).\n" +
                "*Sachant que toutes les demandes où le pseudo demandé ne commence pas par votre prénom se verront refusées.*",
                ephemeral: true,
            });
        }
    },
};