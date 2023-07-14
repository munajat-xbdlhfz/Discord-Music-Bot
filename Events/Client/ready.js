const { Client, ActivityType } = require('discord.js')
require("dotenv").config()

const mongoose = require("mongoose")
const database = process.env.DATABASE_URL

module.exports = {
    name: 'ready',
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    execute(client) {
        console.log(`[Discord] Client logged in as ${client.user.username}`)
        client.user.setActivity('Community', { type: ActivityType.Watching });

        if (!database) return
        mongoose.connect(database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("[Discord] Client connected to database!");
        }).catch((err) => console.log(err));
    }
}