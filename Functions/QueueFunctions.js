const { MessageEmbed } = require("discord.js")

module.exports = {
    execute(queue) {
        let over, maxLength
        const queueEmbed = new MessageEmbed()
        .setColor("AQUA")
        .setTitle("Queue List:")

        function escapeMarkdown(text) {
            var unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
            var escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
            return escaped
        }
        
        if (!queue || !queue[1]) {    
            queueEmbed.setDescription("Join a voice channel and queue songs by name or url in here.")
        } else {
            over = ``
            maxLength = queue.length
            
            if (queue.length > 21) {
                maxLength = 21
                over = `And **${queue.length - (20 + 1)}** more...`
            }
            
            queueEmbed.setDescription(`${over} ${queue.slice(1, 21).reverse().map((song, id) => 
                `\n**${Math.abs(maxLength - (id + 1))}**.   ${escapeMarkdown(song.name)} - [${song.formattedDuration}]`
            )}`)
        }
        
        return queueEmbed
    }
}