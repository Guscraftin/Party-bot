const { EmbedBuilder } = require("discord.js");

/**
 * Come from the button "Valider" in the file "src\modals\panel\modal-rename.js".
 * Validate the new nickname of the user.
 */

module.exports = {
    data: {
        name: "valider-rename",
    },
    async execute(interaction) {
        const membreId = interaction.message.embeds[0].footer.text.slice(12);

        const member = await interaction.guild.members.fetch(membreId);
        if (!member) return interaction.reply({ content: "Le membre n'a pas été trouvé !", ephemeral: true });

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.message.embeds[0].author.name, iconURL: interaction.message.embeds[0].author.iconURL })
            .setColor("#26b500")
            .setDescription(`**${membre} a changé son speudo !**\n`)
            .addFields(
                { name: "Ancien pseudo :", value: membre.user.username, inline: true },
                { name: "Pseudo actuel :", value: membre.nickname, inline: true },
            )
            .setFooter({ text: interaction.message.embeds[0].footer.text });

        await interaction.message.edit({ embeds: [embed], components: [] });

        await interaction.reply({
            content: "Vous avez bien validé son speudo !",
            ephemeral: true,
        });
    },
};