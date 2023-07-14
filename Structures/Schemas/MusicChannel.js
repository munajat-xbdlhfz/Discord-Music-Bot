const { Schema, model } = require("mongoose")

module.exports = model(
    "MusicChannel", new Schema({
        GuildID: String,
        ChannelID: String,
        EmbedID: String,
    })
)