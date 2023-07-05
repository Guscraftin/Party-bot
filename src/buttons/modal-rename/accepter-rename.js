const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

/**
 * Come from the button "Accepter" in the file "src\modals\panel\modal-rename.js".
 * Accept the new nickname of the user.
 */

module.exports = {
    data: {
        name: "accepter-rename",
    },
    async execute(interaction) {
        const newName = interaction.message.embeds[0].fields[1].value;
        const membreId = interaction.message.embeds[0].footer.text.slice(12);

        const member = await interaction.guild.members.fetch(membreId);
        if (!member) return interaction.reply({ content: "Le membre n'a pas été trouvé !", ephemeral: true });

        const oldName = member.nickname;
        await member.setNickname(newName, "Sur demande du membre après acceptation");

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.message.embeds[0].author.name, iconURL: interaction.message.embeds[0].author.iconURL })
            .setColor("#26b500")
            .setDescription(`**${member} veut changer son speudo !**\n`)
            .addFields(
                { name: "Pseudo actuel :", value: oldName, inline: true },
                { name: "Pseudo souhaité :", value: newName, inline: true },
            )
            .setFooter({ text: interaction.message.embeds[0].footer.text });

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
        await member.send("A la suite de votre demande pour changer votre pseudo, celle-ci a été __acceptée__.\n" +
        `En effet, votre pseudo est passé de \`${oldName}\` à \`${newName}\` !`);

        await interaction.reply({
            content: "Le membre a bien été renommé !",
            ephemeral: true,
        });
    },
};