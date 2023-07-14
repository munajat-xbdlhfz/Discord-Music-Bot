const { Client, EmbedBuilder } = require("discord.js")
const { QueueRepeatMode } = require("discord-player")

module.exports = {
    data: {
        name: `music-stop`
    },
    /**
     * 
     * @param {Client} client 
     */
    async execute(interaction) {
        const { guild, member } = interaction;
        const voiceChannel = member.voice.channel
        
        try {
            if (!voiceChannel)
            return interaction.reply({
                content: "You must be in a voice channel to be able to use the music commands.", 
                ephemeral: true
            });

            if (guild.members.me.voice.channelId && voiceChannel.id !== guild.members.me.voice.channelId)
                return interaction.reply({
                    content: `I'm already playing music in <#${guild.members.me.voice.channelId}>.`, 
                    ephemeral: true
                });

            const embed = new EmbedBuilder()
                .setColor("Aqua")
                .setDescription("Song has stoped.")

            const queue = interaction.client.player.nodes.get(guild)

            if (!queue)
                embed.setDescription("There is nothing playing.")
            else {
                queue.setRepeatMode(QueueRepeatMode.OFF)
                queue.node.stop()
            }

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Error while using button: ${error.message}`)

            return interaction.reply({ embeds: [embed] }).then(reply => {
                setTimeout(() => {
                  reply.delete();
                }, 5000)
            })
        }
    }
}