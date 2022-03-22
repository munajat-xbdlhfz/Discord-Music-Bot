const { MessageEmbed } = require("discord.js")
const client = require("../../main")
const musicStop = require("../Music/Stop")

module.exports = {
    id: "Skip",
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

            if (!queue.songs[1])
            return musicStop.execute(interaction)

            await queue.skip(VoiceChannel);
            return interaction.reply({embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`⏭ Song has been skipped.`)
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