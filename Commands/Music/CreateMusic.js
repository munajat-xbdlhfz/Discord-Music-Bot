const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js')
const { playEmbed, queueEmbed } = require("../../Functions/Music/MusicEmbed")
const { musicButton } = require("../../Functions/Music/MusicButton")
const musicSchema = require("../../Structures/Schemas/MusicChannel")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription("Complete music system")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(subcommand => 
            subcommand.setName('create').setDescription('create music channel')
        ),
    async execute(interaction, client) {
        const { guild } = interaction

        try {
            let data = await musicSchema.findOne({ GuildID: guild.id })

            if (data && guild.channels.cache.get(data.ChannelID))
                return interaction.reply({
                    content: `Music channel already created in <#${data.ChannelID}>`
                })

            const channelOptions = {
                name: 'music-request',
                topic: 'Welcome to the music-request',
            }

            await guild.channels.create(channelOptions).then(async(channel) => {
                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`✅ Successfully created music channel: ${channel}`)

                interaction.reply({ embeds: [embed] })

                client.channels.cache.get(channel.id).send({
                    embeds: [await queueEmbed(), await playEmbed(client)],
                    components: [await musicButton()]
                }).then(async (msg) => {
                    await musicSchema.findOneAndUpdate(
                        { GuildID: guild.id },
                        { ChannelID: channel.id, EmbedID: msg.id },
                        { new: true, upsert: true }
                    )
                })
            })
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Error on creating music channel: ${error.message}`)

            return interaction.reply({ embeds: [embed] }).then(reply => {
                setTimeout(() => {
                  reply.delete();
                }, 5000)
            })
        }
    }
}