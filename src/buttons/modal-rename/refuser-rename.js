const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

/**
 * Come from the button "Refuser" in the file "src\modals\panel\modal-rename.js".
 * Refuse the new nickname of the user.
 */

module.exports = {
    data: {
        name: "refuser-rename",
    },
    async execute(interaction) {
        const oldEmbed = interaction.message.embeds[0];
        const membreId = oldEmbed.footer.text.slice(12);

        const member = await interaction.guild.members.fetch(membreId);
        if (!member) return interaction.reply({ content: "Le membre n'a pas été trouvé !", ephemeral: true });

        const newName = oldEmbed.fields[1].value;
        const embed = new EmbedBuilder()
            .setAuthor(oldEmbed.author)
            .setColor("#b50000")
            .setDescription(oldEmbed.description)
            .addFields(oldEmbed.fields)
            .setFooter(oldEmbed.footer);

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("accepter")
                    .setEmoji("✏️")
                    .setLabel("Accepter")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId("refuser")
                    .setEmoji("⛔")
                    .setLabel("Refuser")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
            );
        await interaction.message.edit({ embeds: [embed], components: [buttons] });
        await member.send("A la suite de votre demande pour changer votre pseudo, celle-ci a été __refusé__.\n" +
            "En effet, **votre pseudo doit commencer par votre `Prénom`**.\n" +
            `De ce fait, il reste \`${member.nickname}\` et ne change pas en \`${newName}\` !\n\n` +
            "*PS : Pour toute réclamation ou pour en comprendre les raisons, envoyez un message à <@265785336175656970> !*",
        );

        await interaction.reply({
            content: "Le membre a été avertit de votre refus !",
            ephemeral: true,
        });
    },
};