const { Client, CommandInteraction, MessageEmbed } = require("discord.js")

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.reply({embeds: [
                new MessageEmbed()
                .setColor("RED")
                .setDescription("⛔ An error occured while running this command.")
            ]}) && client.commands.delete(interaction.commandName);

            command.execute(interaction, client)
        }

        if (interaction.isSelectMenu()) {
            const { customId, values, member } = interaction;
            
            if (customId !== "role-assign") return;
            
            if (customId === "role-assign") {
                const component = interaction.component;
                const removed = component.options.filter((option) => {
                    return !values.includes(option.value)
                })

                for (const id of removed) {
                    member.roles.remove(id.value)
                }
                
                for (const id of values) {
                    member.roles.add(id)
                }

                interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("✅ Roles have been updated!")], ephemeral: true})
            }
        }
    }
}