const { EmbedBuilder } = require("discord.js");
const { color_accept } = require(process.env.CONST);

/**
 * Come from the button "Accepter" in the file "src\modals\panel\modal-rename.js".
 * Accept the new nickname of the user.
 */

module.exports = {
    data: {
        name: "accepter-rename",
    },
    async execute(interaction) {
        const oldEmbed = interaction.message.embeds[0];
        const membreId = oldEmbed.footer.text.slice(12);

        const member = await interaction.guild.members.fetch(membreId);
        if (!member) return interaction.reply({ content: "Le membre n'a pas été trouvé !", ephemeral: true });

        const oldName = member.nickname ? member.nickname : oldEmbed.fields[0].value;
        const newName = oldEmbed.fields[1].value;
        await member.setNickname(newName, "Sur demande du membre après acceptation");

        const embed = new EmbedBuilder()
            .setAuthor(oldEmbed.author)
            .setColor(color_accept)
            .setDescription(oldEmbed.description)
            .addFields(oldEmbed.fields)
            .setFooter(oldEmbed.footer);

        await interaction.message.edit({ embeds: [embed], components: [] });
        await member.send("A la suite de votre demande pour changer votre pseudo, celle-ci a été __acceptée__.\n" +
        `En effet, votre pseudo est passé de \`${oldName}\` à \`${newName}\` !`);

        await interaction.reply({
            content: "Le membre a bien été renommé et avertit de votre acceptation !",
            ephemeral: true,
        });
    },
};