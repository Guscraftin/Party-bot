const { Events } = require("discord.js");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            await member.send(`👋 Bonjour ${member.user.username}, je suis \`Party Bot\`, le bot qui gère le serveur **${member.guild.name}**.\n` +
            "Je te contacte pour me présenter et pour te remercier d'avoir rejoint ce serveur.\n\n" +
            "> Sur celui-ci, tu pourras **organiser ta propre soirée ou ton propre événement** 🎉 !\n" +
            "> De plus, tu pourras facilement être invité aux soirées organisées sur le serveur.\n" +
            "> D'ailleurs, en rejoingnant ce serveur, tu diminues le risque d'être oublié dans la liste des invités à un événement.\n\n" +
            "**N'oublie pas de te renommer** grâce au bouton sous le panel et **d'inviter tes amis** pour toi aussi organiser tes soirées sur ce serveur avec tout le monde 😉 !");
            // Ajouter en embed avec le lien vers le panel
        } catch (e) {
            console.error(e);
        }
    },
};