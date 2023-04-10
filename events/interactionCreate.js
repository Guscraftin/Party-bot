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

        } else if (interaction.isButton()) {
            const { buttons } = interaction.client;
            const { customId } = interaction;
            const button = buttons.get(customId);
            if (!button) return new Error("There is no code for this button.");

            try {
                await button.execute(interaction);
            } catch (error) {
                console.error(`Erreur d'exécution du boutton : ${interaction.customId}`);
                if (!error.includes("Unknown interaction")) {
                    console.error(error);
                }
            }
        } else if (interaction.isModalSubmit()) {
            const { modals } = interaction.client;
            const { customId } = interaction;
            const modal = modals.get(customId);
            if (!modal) return new Error("There is no code for this modal.");

            try {
                await modal.execute(interaction);
            } catch (error) {
                console.error(`Erreur d'exécution du boutton : ${interaction.customId}`);
                console.error(error);
            }

        } else {
            console.log("Interaction inconnu !");
        }
    },
};
