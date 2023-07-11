const { Collection, EmbedBuilder } = require("discord.js");
const { adminPseudoLogId, color_basic } = require(process.env.CONST);

/**
 * Come from the button "Le renommer" in the file "src\commands\contextMenus\pseudo.js".
 */

module.exports = {
    data: {
        name: "modal-pseudo",
    },
    async execute(interaction) {
        const newName = interaction.fields.getTextInputValue("newPseudo");
        const userId = interaction.message.content.split("<@")[1].split(">")[0];
        const member = await interaction.guild.members.fetch(userId);
        if (!member || member instanceof Collection) return interaction.reply({ content: "Le membre n'a pas été trouvé.", ephemeral: true });

        // Rename the member
        const oldName = member.displayName;
        await member.setNickname(newName, "Sur demande du staff");

        // Create the log embed
        const embed = new EmbedBuilder()
            .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })
            .setColor(color_basic)
            .setDescription(`**${interaction.member} a changé le speudo de ${member} !**\n`)
            .addFields(
                { name: "Ancien pseudo :", value: oldName, inline: true },
                { name: "Pseudo actuel :", value: newName, inline: true },
            )
            .setFooter({ text: `Id membre : ${member.id}` });

        const pseudoLogChannel = await interaction.guild.channels.fetch(adminPseudoLogId);
        if (!pseudoLogChannel || pseudoLogChannel instanceof Collection) return interaction.reply({ content: "La log n'a pas pu être correctement envoyée.", ephemeral: true });

        await pseudoLogChannel.send({ embeds: [embed] });
        return interaction.reply({
            content: `Le pseudo de ${member} a bien été changé de \`${oldName}\` en \`${newName}\` !`,
            ephemeral: true,
        });
    },
};