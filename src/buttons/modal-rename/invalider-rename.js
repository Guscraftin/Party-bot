const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "invalider-rename",
    },
    async execute(interaction) {
        const membreId = interaction.message.embeds[0].footer.text.slice(12);
        await interaction.guild.members.fetch(membreId)
            .then(async function(membre) {
                const oldName = membre.user.username;
                const newName = membre.nickname;
                const embed = new EmbedBuilder()
                    .setAuthor({ name: membre.user.tag, iconURL: membre.user.displayAvatarURL() })
                    .setColor("#b50000")
                    .setDescription(`**${membre} a changé son speudo !**\n`)
                    .addFields(
                        { name: "Ancien pseudo :", value: oldName, inline: true },
                        { name: "Pseudo actuel :", value: newName, inline: true },
                    )
                    .setFooter({ text: `Id membre : ${membre.user.id}` });

                interaction.message.edit({ embeds: [embed], components: [] });

                await membre.setNickname(null, "Pseudo non valide");
                await membre.send("A la suite de votre changement de pseudo, celle-ci a été annulé.\n" +
                    `En effet, votre pseudo revient à \`${oldName}\` et ne reste pas en \`${newName}\` !\n` +
                    "**Veuillez mettre votre `Prénom` au début de votre speudo.**\n\n" +
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