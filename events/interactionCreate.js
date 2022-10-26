const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`Aucune commande nommé ${interaction.commandName} n'a été trouvé sur le serveur !`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Erreur d'exécution de la commande : ${interaction.commandName}`);
                console.error(error);
            }
        }
        // else if (interaction.isButton()) {

        // }
    },
};
