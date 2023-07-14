const { Client, EmbedBuilder } = require("discord.js")
const { QueueRepeatMode } = require("discord-player")
const { updateRepeat } = require("../../Functions/Music/MusicReply")

module.exports = {
    data: {
        name: `music-repeat`
    },
    /**
     * 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { guild, member } = interaction;
        const voiceChannel = member.voice.channel
        
        try {
            let mode

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

            const embed = new EmbedBuilder().setColor("Aqua")

            const queue = interaction.client.player.nodes.get(guild)

            if (!queue)
                embed.setDescription("There is nothing playing.")
            else {
                const newRepeatMode = queue.repeatMode + 1
                
                if (newRepeatMode % 3 == 1) {
                    mode = "TRACK"
                    queue.setRepeatMode(QueueRepeatMode.TRACK)
                    embed.setDescription("Looping the current track.")
                } else if (newRepeatMode % 3 == 2) {
                    mode = "QUEUE"
                    queue.setRepeatMode(QueueRepeatMode.QUEUE)
                    embed.setDescription("Looping the current queue.")
                }
                else {
                    mode = "OFF"
                    queue.setRepeatMode(QueueRepeatMode.OFF)
                    embed.setDescription("Turned off repeat mode.")
                }

                updateRepeat(client, queue, mode)
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