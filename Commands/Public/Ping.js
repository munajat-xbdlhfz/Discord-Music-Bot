const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Return bot ping"),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client) {
        await interaction.reply({
            content: `Client Ping: ${client.ws.ping}`,
            ephemeral: true,
        });
    }
}