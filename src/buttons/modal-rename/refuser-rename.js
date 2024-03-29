const { EmbedBuilder } = require("discord.js");
const { color_decline } = require(process.env.CONST);

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
            .setColor(color_decline)
            .setDescription(oldEmbed.description)
            .addFields(oldEmbed.fields)
            .setFooter(oldEmbed.footer);

        await interaction.message.edit({ embeds: [embed], components: [] });
        await member.send("A la suite de votre demande pour changer votre pseudo, celle-ci a été __refusé__.\n" +
            "En effet, **votre pseudo doit commencer par votre `Prénom` suivit d'un espace**.\n" +
            `De ce fait, il reste \`${member.displayName}\` et ne change pas en \`${newName}\` !\n` +
            "*PS : Pour toute réclamation ou pour en comprendre les raisons, envoyez un message à <@265785336175656970> !*",
        );

        await interaction.reply({
            content: "Le membre a été avertit de votre refus !",
            ephemeral: true,
        });
    },
};