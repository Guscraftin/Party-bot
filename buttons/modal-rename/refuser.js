const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: {
        name: "refuser",
    },
    async execute(interaction) {
        const newName = interaction.message.embeds[0].fields[1].value;
        const membreId = interaction.message.embeds[0].footer.text.slice(12);
        await interaction.guild.members.fetch(membreId)
            .then(async function(membre) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: membre.user.tag, iconURL: membre.user.displayAvatarURL() })
                    .setColor("#b50000")
                    .setDescription(`**${membre} veut changer son speudo !**\n`)
                    .addFields(
                        { name: "Pseudo actuel :", value: membre.nickname, inline: true },
                        { name: "Pseudo souhaité :", value: newName, inline: true },
                    )
                    .setFooter({ text: `Id membre : ${membre.user.id}` });
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
                interaction.message.edit({ embeds: [embed], components: [buttons] });

                await membre.send("A la suite de votre demande pour changer votre pseudo, celle-ci a été refusé.\n" +
                    `En effet, votre pseudo reste \`${membre.nickname}\` et ne change pas en \`${newName}\` !\n\n` +
                    "*PS : Pour toute réclamation ou pour en comprendre les raisons, répondez à ce message afin que je vous mette en contacte avec le responsable !*",
                );
                await interaction.reply({
                    content: "Le membre a été avertit de votre refus !",
                    ephemeral: true,
                });
            })
            .catch((error) => console.error(error));
    },
};