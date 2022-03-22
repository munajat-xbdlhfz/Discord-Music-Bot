const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
require("../../Events/Client/ready")

module.exports = {
    name: "ping",
    description: "Displays the bot ping.",
    /**
     * 
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
     async execute(interaction, client) {
        const Response = new MessageEmbed()
        .setColor("AQUA")
        .setTitle("Bot Status")
        .setDescription(`🟢 **Client Ping**: ${client.ws.ping}ms\n`)
        
        interaction.reply({embeds: [Response]})
    }
}