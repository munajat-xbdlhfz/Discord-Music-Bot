const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")

async function musicButton() {
    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("music-pause").setStyle(ButtonStyle.Secondary).setLabel("PAUSE/RESUME"),
        new ButtonBuilder().setCustomId("music-skip").setStyle(ButtonStyle.Secondary).setLabel("SKIP"),
        new ButtonBuilder().setCustomId("music-repeat").setStyle(ButtonStyle.Secondary).setLabel("LOOP"),
        new ButtonBuilder().setCustomId("music-shuffle").setStyle(ButtonStyle.Secondary).setLabel("SHUFFLE"),
        new ButtonBuilder().setCustomId("music-stop").setStyle(ButtonStyle.Secondary).setLabel("STOP"),
    )

    return button
}

module.exports = { musicButton }