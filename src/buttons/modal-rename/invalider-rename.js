const { EmbedBuilder } = require("discord.js");

/**
 * Come from the button "Refuser" in the file "src\modals\panel\modal-rename.js".
 * Refuse the new nickname of the user.
 */

module.exports = {
    data: {
        name: "invalider-rename",
    },
    async execute(interaction) {
        const membreId = interaction.message.embeds[0].footer.text.slice(12);

        const member = await interaction.guild.members.fetch(membreId);
        if (!member) return interaction.reply({ content: "Le membre n'a pas été trouvé !", ephemeral: true });

        const oldName = member.user.username;
        const newName = member.nickname;
        const embed = new EmbedBuilder()
            .setAuthor({ name: member.user.displayName, iconURL: member.user.displayAvatarURL() })
            .setColor("#b50000")
            .setDescription(`**${member} a changé son speudo !**\n`)
            .addFields(
                { name: "Ancien pseudo :", value: oldName, inline: true },
                { name: "Pseudo actuel :", value: newName, inline: true },
            )
            .setFooter({ text: `Id membre : ${member.user.id}` });

        await interaction.message.edit({ embeds: [embed], components: [] });

        await member.setNickname(null, "Pseudo non valide");
        await member.send("A la suite de votre changement de pseudo, celle-ci a été annulé.\n" +
            `En effet, votre pseudo revient à \`${oldName}\` et ne reste pas en \`${newName}\` !\n` +
            "**Veuillez mettre votre `Prénom` au début de votre speudo.**\n\n" +
            "*PS : Pour toute réclamation ou pour en comprendre les raisons, répondez à ce message afin que je vous mette en contacte avec le responsable !*",
        );

        await interaction.reply({
            content: "Le membre a été avertit de votre refus !",
            ephemeral: true,
        });
    },
};