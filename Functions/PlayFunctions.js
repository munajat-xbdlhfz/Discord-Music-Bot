const { MessageEmbed } = require("discord.js")
const client = require("../main")

module.exports = {
    execute(queue, song) {
        const playEmbed = new MessageEmbed()
        .setColor("AQUA")

        function escapeMarkdown(text) {
            var unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
            var escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
            return escaped
        }
        
        const status = queue => `Volume: ${queue.volume}% | Filter: ${queue.filters.join(", ") || "Off"} | Loop: ${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}`

        if (!song) {
            playEmbed.setTitle("No song playing currently")
            playEmbed.setFooter({ text: `${client.user.username}` })
            playEmbed.setImage("https://www.wallpaperuse.com/wallp/91-919178_m.jpg")
        } else {
            playEmbed.setTitle(`${escapeMarkdown(song.name)} - [${song.formattedDuration}]`)
            playEmbed.setFooter({ text: `${client.user.username} | ${status(queue)}` })
            playEmbed.setImage(`${song.thumbnail}`)
        }

        return playEmbed
    }
}