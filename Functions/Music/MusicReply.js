const { musicButton } = require("./MusicButton")
const { playEmbed, queueEmbed } = require('./MusicEmbed')
const musicSchema = require("../../Structures/Schemas/MusicChannel")

const setMusicReply = async (client, queue, track) => {
    try {
        let data = await musicSchema.findOne({ GuildID: queue.options.guild.id})

        if (!data) return

        const queueEmbeds = await queueEmbed(queue, track)
        const playEmbeds = await playEmbed(client, queue, track)
        const buttonComponents = await musicButton()

        return client.channels.cache.get(data.ChannelID).messages.fetch(data.EmbedID).then(msg => {
            msg.edit({
                embeds: [queueEmbeds, playEmbeds],
                components: [buttonComponents]
            })
        })
    } catch (error) {
        console.log(error.message)
    }
}

const updateQueue = async (client, queue) => {
    try {
        let data = await musicSchema.findOne({ GuildID: queue.options.guild.id})

        if (!data) return

        const queueEmbeds = await queueEmbed(queue)
        const buttonComponents = await musicButton()

        return client.channels.cache.get(data.ChannelID).messages.fetch(data.EmbedID).then(msg => {
            msg.edit({
                embeds: [queueEmbeds, msg.embeds[1]],
                components: [buttonComponents]
            })
        })
    } catch (error) {
        console.log(error.message)
    }
}

const updateRepeat = async (client, queue, mode) => {
    try {
        let data = await musicSchema.findOne({ GuildID: queue.options.guild.id})

        if (!data) return

        const buttonComponents = await musicButton()

        return client.channels.cache.get(data.ChannelID).messages.fetch(data.EmbedID).then(msg => {
            let footerText = msg.embeds[1].data.footer.text.split(" | ")
            let newFooterText = `${footerText[0]} | Loop: ${mode}`

            msg.embeds[1].data.footer.text = newFooterText

            msg.edit({
                embeds: [msg.embeds[0], msg.embeds[1]],
                components: [buttonComponents]
            })
        })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    setMusicReply,
    updateQueue,
    updateRepeat,
}