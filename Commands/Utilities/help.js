const { CommandInteraction, Client, MessageEmbed } = require("discord.js")

module.exports = {
    name: "help",
    description: "Get help command.",
    /**
     * 
     * @param {CommandInteraction} interaction
     * @param {Client} client 
     */
    execute(interaction, client) {
        const { guild } = interaction;

        const help = new MessageEmbed()
        .setColor("AQUA")
        .setTitle(`${client.user.username} Commands`)
        .addFields(
            { name: `/help`, value: `↪ Get a help about bot commands.` },
            { name: `/ping`, value: `↪ Displays the bot ping.` },
            { name: `/music settings`, value: `↪ Select option settings on music bot.` },
        )

        interaction.reply({embeds: help});
    }
}