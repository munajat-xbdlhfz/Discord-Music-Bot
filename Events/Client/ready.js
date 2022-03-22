const { Client } = require("discord.js")
const mongoose = require("mongoose")
const database = process.env.DATABASE_URL
require('dotenv').config()

module.exports = {
    name: "ready",
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    execute(client) {
        console.log(`S.S.S Music Discord Bot is Online!`)
        client.user.setActivity("S.S.S Music", {type: "LISTENING"})

        if (!database) return;
        mongoose.connect(database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("The client is now connected to database!")
        }).catch((err) => {
            console.log(err)
        })
    }
}