const { Client, Collection } = require("discord.js")
const client = new Client({intents: 32767})
client.options.http.api = "https://discord.com/api"

require('dotenv').config()

const { promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)
const Ascii = require("ascii-table")

client.commands = new Collection();
client.buttons = new Collection();

const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp")
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");

client.distube = new DisTube(client, {
    youtubeDL: false,
    leaveOnEmpty: true,
    leaveOnStop: false,
    leaveOnFinish: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [
        new YtDlpPlugin(),
        new SoundCloudPlugin(),
        new SpotifyPlugin({ emitEventsAfterFetching: true })
    ]
});
module.exports = client;

client.distube.setMaxListeners(0);

["Events", "Commands", "Buttons"].forEach(handler => {
    require(`./Structures/Handlers/${handler}`)(client, PG, Ascii);
});

client.login(process.env.BOT_TOKEN)