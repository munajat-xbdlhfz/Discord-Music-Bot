const { Client, EmbedBuilder } = require("discord.js")
const { updateQueue } = require("../../Functions/Music/MusicReply")

module.exports = {
    data: {
        name: `music-shuffle`
    },
    /**
     * 
     * @param {Client} client 
     */
    async execute(interaction, client) {
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

            const embed = new EmbedBuilder().setColor("Aqua")

            const queue = interaction.client.player.nodes.get(guild)

            if (!queue)
                embed.setDescription("There is nothing playing.")
            else if (queue.size < 3)
                embed.setDescription("Need at least 3 tracks in the queue to shuffle.")
            else {
                queue.tracks.shuffle()
                embed.setDescription("Shuffle queue song.")
                updateQueue(client, queue)
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