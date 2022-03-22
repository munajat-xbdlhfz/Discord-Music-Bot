const { MessageButton, MessageActionRow } = require("discord.js")

module.exports = {
    execute() {
        const Buttons = new MessageActionRow();
        Buttons.addComponents(
            new MessageButton().setCustomId("ResumePause").setStyle("SUCCESS").setEmoji("⏯"),
            new MessageButton().setCustomId("Skip").setStyle("PRIMARY").setEmoji("⏭"),
            new MessageButton().setCustomId("Repeat").setStyle("PRIMARY").setEmoji("🔁"),
            new MessageButton().setCustomId("Shuffle").setStyle("PRIMARY").setEmoji("🔀"),
            new MessageButton().setCustomId("Stop").setStyle("DANGER").setEmoji("⏹"),
        );

        return Buttons
    }
}