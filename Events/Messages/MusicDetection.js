const { Client, CommandInteraction, EmbedBuilder } = require("discord.js")
const musicSchema = require("../../Structures/Schemas/MusicChannel")

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {CommandInteraction} message 
     * @param {Client} client 
     */
    async execute(message, client) {
        if (message.author.bot) return;
        
        const { guild, member, channel } = message;
        const voiceChannel = member.voice.channel

        try {
            const data = await musicSchema.findOne({ GuildID: guild.id })

            if (!data) return
            if (channel.id !== data.ChannelID) return

            if (!voiceChannel) {
                const msg = await message.reply({
                    content: "You must be in a voice channel to be able to use the music commands.", 
                    ephemeral: true
                });
                setTimeout(() => {
                    message.delete().catch(() => {})
                    msg.delete()
                }, 3000);
                return;
            }

            if (guild.members.me.voice.channelId && voiceChannel.id !== guild.members.me.voice.channelId) {
                const msg = await message.reply({
                  content: `I'm already playing music in <#${guild.members.me.voice.channelId}>.`, 
                  ephemeral: true
                });
                setTimeout(() => {
                  message.delete().catch(() => {})
                  msg.delete()
                }, 3000)

                return
            }

            await client.player.play(member.voice.channel.id, message.content, {
                nodeOptions: {
                    metadata: {
                        channel: member.voice.channel.id,
                        client: guild.members.me,
                        requestedBy: member.user.username
                    },
                    volume: 10,
                    bufferingTimeout: 3000
                },
            })

            message.delete().catch(() => {});
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(error.message)

            message.reply({ embeds: [embed] }).then(reply => {
                setTimeout(() => {
                  reply.delete();
                }, 5000)
            })

            return
        }
    }
}