const { MessageEmbed } = require("discord.js")
const client = require("../../main")
const Schema = require("../../Structures/Schemas/MusicChannelDB")
const Buttons = require("../../Functions/ButtonFunctions")
const queueEmbed = require("../../Functions/QueueFunctions")
const playEmbed = require("../../Functions/PlayFunctions")

module.exports.name = "distubeEvents"

function escapeMarkdown(text) {
    var unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    var escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
}

client.distube.on("playSong", (queue, song) => {
    Schema.findOne({ GuildID: queue.id }, async (err, data) => {
        if (err) throw err;
        if (!data) return;

        return client.channels.cache.get(data.ChannelID).messages.fetch(data.EmbedID).then(msg => {
            msg.edit({
                embeds: [queueEmbed.execute(queue.songs), playEmbed.execute(queue, song)], 
                components: [Buttons.execute()]
            })
        });
    })
})

client.distube.on("addSong", (queue, song) => {
    Schema.findOne({ GuildID: queue.id }, async (err, data) => {
        if (err) throw err;
        if (!data) return;

        client.channels.cache.get(data.ChannelID).send({embeds: [new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`Added ${escapeMarkdown(song.name)} - [${song.formattedDuration}] to the queue.`)
        ]}).then(msg => {
            setTimeout(() => msg.delete(), 3000)
        })

        return client.channels.cache.get(data.ChannelID).messages.fetch(data.EmbedID).then(msg => {
            msg.edit({
                embeds: [queueEmbed.execute(queue.songs), playEmbed.execute(queue, queue.songs[0])], 
                components: [Buttons.execute()]
            })
        })
    })
})

client.distube.on("addList", (queue, playlist) => {
    Schema.findOne({ GuildID: queue.id }, async (err, data) => {
        if (err) throw err;
        if (!data) return;

        client.channels.cache.get(data.ChannelID).send({embeds: [new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`Added ${playlist.songs.length} song from **${escapeMarkdown(playlist.name)}** playlist to queue.`)
        ]}).then(msg => {
            setTimeout(() => msg.delete(), 5000)
        })

        return client.channels.cache.get(data.ChannelID).messages.fetch(data.EmbedID).then(msg => {
            msg.edit({
                embeds: [queueEmbed.execute(queue.songs), playEmbed.execute(queue, queue.songs[0])], 
                components: [Buttons.execute()]
            })
        })
    })
})

client.distube.on("error", (queue, e) => {
    Schema.findOne({ GuildID: queue.id }, async (err, data) => {
        if (err) throw err;
        if (!data) return;

        return client.channels.cache.get(data.ChannelID).send({embeds: [new MessageEmbed()
            .setColor("RED")
            .setDescription(`⛔ | An error encountered: ${e}`)
        ]}).then(msg => {
            setTimeout(() => msg.delete(), 10000)
        })
    })
})

client.distube.on("empty", (queue) => {
    Schema.findOne({ GuildID: queue.id }, async (err, data) => {
        if (err) throw err;
        if (!data) return;

        client.channels.cache.get(data.ChannelID).messages.fetch(data.EmbedID).then(msg => {
            msg.edit({
                embeds: [queueEmbed.execute(), playEmbed.execute()], 
                components: [Buttons.execute()]
            });
        })

        return client.channels.cache.get(data.ChannelID).send({embeds: [new MessageEmbed()
            .setColor("RED")
            .setDescription("Voice channel is empty! Leaving the channel.")
        ]}).then(msg => {
            setTimeout(() => msg.delete(), 5000)
        })
    })
})

client.distube.on("searchNoResult", (queue) => {
    Schema.findOne({ GuildID: queue.id }, async (err, data) => {
        if (err) throw err;
        if (!data) return;

        return client.channels.cache.get(data.ChannelID).send({embeds: [new MessageEmbed()
            .setColor("RED")
            .setDescription("⛔ | No result found!")
        ]}).then(msg => {
            client.channels.cache.get(data.ChannelID).message.delete().catch(() => {})
            setTimeout(() => msg.delete(), 3000)
        })
    })
})

client.distube.on("finish", (queue) => {
    Schema.findOne({ GuildID: queue.id }, async (err, data) => {
        if (err) throw err;
        if (!data) return;

        return client.channels.cache.get(data.ChannelID).messages.fetch(data.EmbedID).then(msg => {
            msg.edit({
                embeds: [queueEmbed.execute(), playEmbed.execute()], 
                components: [Buttons.execute()]
            });
        })
    })
})