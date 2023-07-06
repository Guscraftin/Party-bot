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
        const oldEmbed = interaction.message.embeds[0];
        const membreId = oldEmbed.footer.text.slice(12);

        const member = await interaction.guild.members.fetch(membreId);
        if (!member) return interaction.reply({ content: "Le membre n'a pas été trouvé !", ephemeral: true });

        const embed = new EmbedBuilder()
            .setAuthor(oldEmbed.author)
            .setColor("#26b500")
            .setDescription(oldEmbed.description)
            .addFields(oldEmbed.fields)
            .setFooter(oldEmbed.footer);

        await interaction.message.edit({ embeds: [embed], components: [] });

        await interaction.reply({
            content: "Vous avez bien validé son speudo !",
            ephemeral: true,
        });
    },
};