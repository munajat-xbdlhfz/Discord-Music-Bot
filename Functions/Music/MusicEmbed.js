const { EmbedBuilder } = require("discord.js")
const probe = require('probe-image-size')
require("dotenv").config()

const getImageMetadata = async (url) => {
    try {
        return await probe(url)
    } catch (error) {
        return null
    }
}

const playEmbed = async (client, queue, track) => {
    const embed = new EmbedBuilder().setColor("Aqua")
    
    try {
        let loop, icon

        if (!track) {
            embed.setTitle("No song playing currently")
            embed.setFooter({ text: `${client.user.username}` })
            embed.setImage(process.env.MUSIC_DEFAULT_THUMBNAIL)
        } else {
            switch (queue.repeatMode) {
                case 0 :
                    loop = "OFF"
                    break
                case 1 :
                    loop = "TRACK"
                    break
                case 2 :
                    loop = "QUEUE"
                    break
            }

            switch (track.source) {
                case "youtube" :
                    icon = "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                    break
                case "spotify" :
                    icon = "https://cdn-icons-png.flaticon.com/512/174/174872.png"
                    break
                case "soundcloud" :
                    icon = "https://cdn-icons-png.flaticon.com/512/145/145809.png"
                    break
            }

            let imageMetadata = await getImageMetadata(track.thumbnail)

            const capitalizedSource = track.source.charAt(0).toUpperCase() + track.source.slice(1);

            embed.setTitle(`${track.title} - [${track.duration === "0:00" ? "LIVE" : track.duration}]`)
            embed.setURL(track.url)
            embed.setFooter({ text: `Source from ${capitalizedSource} | Loop: ${loop}`, iconURL: icon})
            
            // if the thumbnail image is broken, set default image
            if (imageMetadata)
                embed.setImage(track.thumbnail)
            else
                embed.setImage(process.env.MUSIC_DEFAULT_THUMBNAIL)
        }

        return embed
    } catch (error) {
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Error on play embed: ${error.message}`)

        return interaction.reply({ embeds: [embed] }).then(reply => {
            setTimeout(() => {
                reply.delete();
            }, 5000)
        })
    }
}

const queueEmbed = async (queue) => {
    const embed = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle("Queue List:")

    try {
        let maxLength, over
        let list = ""
        var number = 0
        
        if (!queue || queue.size < 1)
            embed.setDescription("Join voice channel and queue songs by name or URL from **Youtube**, **Spotify**, or **Soundcloud** to start enjoying the music!")
        else {
            if (queue.size > 20) {
                maxLength = 20
                over = `And **${queue.size - maxLength}** more...`
            } else {
                maxLength = queue.size
                over = ``
            }

            queue.tracks.data.slice(0, maxLength).reverse().map((track) => {
                if (track.title)
                list = list + `\n**${maxLength - number}**. ${track.title} - [${track.duration === "0:00" ? "LIVE" : track.duration}]`
                number ++
            })

            embed.setDescription(over + list)
        }

        return embed
    } catch (error) {
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Error on queue embed: ${error.message}`)

        return interaction.reply({ embeds: [embed] }).then(reply => {
            setTimeout(() => {
                reply.delete();
            }, 5000)
        })
    }
}

module.exports = {
    playEmbed,
    queueEmbed
}