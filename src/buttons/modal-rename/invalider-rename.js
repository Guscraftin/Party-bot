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
        const oldEmbed = interaction.message.embeds[0];
        const membreId = oldEmbed.footer.text.slice(12);

        const member = await interaction.guild.members.fetch(membreId);
        if (!member) return interaction.reply({ content: "Le membre n'a pas été trouvé !", ephemeral: true });

        const oldName = oldEmbed.fields[0].value;
        const newName = oldEmbed.fields[1].value;
        const embed = new EmbedBuilder()
            .setAuthor(oldEmbed.author)
            .setColor("#b50000")
            .setDescription(oldEmbed.description)
            .addFields(oldEmbed.fields)
            .setFooter(oldEmbed.footer);

        await interaction.message.edit({ embeds: [embed], components: [] });

        await member.setNickname(null, "Pseudo non valide");
        await member.send("A la suite de votre changement de pseudo, celle-ci a été annulé.\n" +
            `En effet, votre pseudo revient à \`${oldName}\` et ne reste pas en \`${newName}\` !\n` +
            "**Veuillez mettre votre `Prénom` au début de votre speudo.**\n\n" +
            "*PS : Pour toute réclamation ou pour en comprendre les raisons, envoyez un message à <@265785336175656970> !*",
        );

        await interaction.reply({
            content: "Le membre a été avertit de votre refus !",
            ephemeral: true,
        });
    },
};