const { CommandInteraction, Client, MessageEmbed } = require("discord.js")
const Schema =  require("../../Structures/Schemas/MusicChannelDB")
const Buttons = require("../../Functions/ButtonFunctions")
const queueEmbed = require("../../Functions/QueueFunctions")
const playEmbed = require("../../Functions/PlayFunctions")

module.exports = {
    name: "music",
    description: "Complete music System.",
    permission: "MANAGE_CHANNELS",
    options: [
        {
            name: "settings",
            description: "Select an option.",
            type: "SUB_COMMAND",
            options: [{ name: "options", description: "Select an option.", type: "STRING", required: true,
            choices: [
                {name: "⚙ Create Music Channel", value: "create"},
            ] }]
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { guild } = interaction;

        try {
            Schema.findOne({ GuildID: guild.id }, async (err, data) => {
                if (err) throw err;
                
                if (data && guild.channels.cache.get(data.ChannelID))
                return interaction.reply({embeds: [new MessageEmbed().setColor("AQUA").setDescription(`Music channel already created in <#${data.ChannelID}>`)]})

                await guild.channels.create(`sss-music-requests`, {
                    type: "GUILD_TEXT",
                    topic: "⏯ Resume/Pause the song.\n⏭ Skip the song.\n🔁 Switch between the loop modes.\n🔀 Shuffle the queue.\n⏹ Stop the song.",
                    permissionOverwrites: [{
                        id: guild.roles.everyone,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                    }]
                }).then(async(channel) => {
                    const Embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`✅ Successfully created music channel: ${channel}`)
            
                    interaction.reply({embeds: [Embed]});
    
                    client.channels.cache.get(channel.id).send({
                        embeds: [queueEmbed.execute(), playEmbed.execute()], 
                        components: [Buttons.execute()]
                    })
                    .then(async msg => {
                        await Schema.findOneAndUpdate(
                            { GuildID: guild.id }, 
                            { ChannelID: channel.id, EmbedID: msg.id }, 
                            { new: true, upsert:true }
                        );
                    })
                });
            })
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