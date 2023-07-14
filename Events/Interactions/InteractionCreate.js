const { InteractionType } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command)
                return interaction.reply({ content: "This command is outdated." });

            command.execute(interaction, client);
        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);

            if (!button)
                return interaction.reply({ content: "There is no code for this button." });
            
            button.execute(interaction, client);
        } else if (interaction.isSelectMenu()) {
            const menu = client.selectMenus.get(interaction.customId);

            if (!menu)
                return interaction.reply({ content: "There is no code for this select menu." });

            menu.execute(interaction, client);
        } else if (interaction.type == InteractionType.ModalSubmit) {
            const modal = client.modals.get(interaction.customId);

            if (!modal)
                return interaction.reply({ content: "There is no code for this select menu." });

            modal.execute(interaction, client);
        } else if (interaction.isContextMenuCommand()) {
            const contextCommand = client.commands.get(interaction.commandName);

            if (!contextCommand) return;

            contextCommand.execute(interaction, client);
        }
    }
}