const { MessageEmbed } = require("discord.js")
const client = require("../../main");
const Schema = require("../../Structures/Schemas/MusicChannelDB")
const Buttons = require("../../Functions/ButtonFunctions")
const queueEmbed = require("../../Functions/QueueFunctions")
const playEmbed = require("../../Functions/PlayFunctions")

module.exports = {
    id: "Repeat",
    async execute(interaction) {
        const { member, guild } = interaction;
        const VoiceChannel = member.voice.channel;

        if (!VoiceChannel)
        return interaction.reply({content: "You must be in a voice channel to be able to use the music commands.", ephemeral: true});

        if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
        return interaction.reply({content: `I'm already playing music in <#${guild.me.voice.channelId}>.`, ephemeral: true});

        try {
            const queue = await client.distube.getQueue(VoiceChannel);

            if (!queue)
            return interaction.reply({content: "There is no songs in queue.", ephemeral: true});

            let Mode2 = await client.distube.setRepeatMode(queue);

            Schema.findOne({ GuildID: guild.id }, async (err, data) => {
                if (err) throw err;
                if (!data) return;
    
                interaction.channel.messages.fetch(data.EmbedID).then(msg => {
                    msg.edit({
                        embeds: [queueEmbed.execute(queue.songs), playEmbed.execute(queue, queue.songs[0])], 
                        components: [Buttons.execute()]
                    })
                })
            })
    
            return interaction.reply({embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`🔁 Repeat Mode is set to: ${Mode2 = Mode2 ? Mode2 == 2 ? "All Queue" : "This Song" : "Off"}`)
            ], ephemeral: true})
        } catch (e) {
            const errorEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`⛔ Alert: ${e}`)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} Music` })
            return interaction.reply({embeds: [errorEmbed]});
        }
    }
}