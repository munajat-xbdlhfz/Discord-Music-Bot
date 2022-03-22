const { Message, Client, MessageEmbed } = require("discord.js")
const Schema = require("../../Structures/Schemas/MusicChannelDB")
const Buttons = require("../../Functions/ButtonFunctions")
const queueEmbed = require("../../Functions/QueueFunctions")
const playEmbed = require("../../Functions/PlayFunctions")

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {
        if (message.author.bot) return;

        const { guild, member, channel } = message;
        const VoiceChannel = member.voice.channel;

        try {
            Schema.findOne({ GuildID: guild.id }, async (err, data) => {
                if (err) throw err;
                if (!data) return;
                if (message.channel.id !== data.ChannelID) return;
    
                if (!VoiceChannel)
                return message.reply({content: "You must be in a voice channel to be able to use the music commands.", ephemeral: true}).then(msg => {                
                    setTimeout(() => {
                        message.delete().catch(() => {})
                        msg.delete()
                    }, 3000)
                });
    
                if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
                return message.reply({content: `I'm already playing music in <#${guild.me.voice.channelId}>.`, ephemeral: true}).then(msg => {
                    setTimeout(() => {
                        message.delete().catch(() => {})
                        msg.delete()
                    }, 3000)
                });
    
                client.distube.play( VoiceChannel, message.content, { textChannel: channel, member: member } );
    
                return message.delete().catch(() => {});
            })
        } catch (e) {
            const errorEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`⛔ Alert: ${e}`)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} Music` })
            return message.reply({embeds: [errorEmbed]});
        }
    }
}