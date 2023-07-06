const { Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { adminPseudoLogId } = require(process.env.CONST);

module.exports = {
    data: {
        name: "modal-rename",
    },
    async execute(interaction) {
        const newName = interaction.fields.getTextInputValue("newName");

        /**
         * If the member has no nickname
         */
        if (interaction.member.nickname === null) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL() })
                .setColor("#5193f8")
                .setDescription(`**${interaction.member} a changé son speudo !**\n`)
                .addFields(
                    { name: "Ancien pseudo :", value: interaction.member.displayName, inline: true },
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

            const pseudoLogChannel = await interaction.guild.channels.fetch(adminPseudoLogId);
            if (!pseudoLogChannel || pseudoLogChannel instanceof Collection) return interaction.reply({ content: "Votre demande n'a pas pu être correctement envoyée.", ephemeral: true });

            await interaction.member.setNickname(newName, "Sur demande du membre");
            await pseudoLogChannel.send({ embeds: [embed], components: [buttons] });

            return interaction.reply({
                content: "Votre pseudo a bien été changé !\n" +
                "Attention, si vous ne vous êtes pas renommé avec un pseudo commençant par votre prénom, votre pseudo sera réinitialisé !",
                ephemeral: true,
            });

        /**
         * If the member has the same nickname
         */
        } else if (interaction.member.nickname === newName) {
            return interaction.reply({
                content: `Le pseudo demandé est déjà celui que vous avez actuellement soit \`${interaction.member.nickname}\` !`,
                ephemeral: true,
            });

        /**
         * If the member has already a nickname
         */
        } else {
            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL() })
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

            const pseudoLogChannel = await interaction.guild.channels.fetch(adminPseudoLogId);
            if (!pseudoLogChannel || pseudoLogChannel instanceof Collection) return interaction.reply({ content: "Votre demande n'a pas pu être correctement envoyée.", ephemeral: true });

            await pseudoLogChannel.send({ embeds: [embed], components: [buttons] });

            return interaction.reply({
                content: "Votre demande pour changer de speudo à bien été envoyé pour traitement.\n" +
                "Vous recevrez le résultat de votre demande en MP (pensez à les autoriser)." +
                "*Sachant que toutes les demandes où le pseudo demandé ne commence pas par votre prénom se verront refusées.*",
                ephemeral: true,
            });
        }
    },
};