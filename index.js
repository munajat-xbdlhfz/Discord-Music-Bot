// import required classes and constants for Discord bot functionality
const { Client, GatewayIntentBits, Partials, Collection } =  require('discord.js')
const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildVoiceStates } = GatewayIntentBits
const { User, Message, GuildMember, ThreadMember, Channel } = Partials

require("dotenv").config();

/* 
    import functions for loading:
    - event handlers
    - command handlers
    - component handlers
*/
const { loadEvents } = require('./Structures/Handlers/EventHandlers')
const { loadCommands } = require('./Structures/Handlers/CommandHandlers')
const { loadComponents } = require("./Structures/Handlers/ComponentHandlers")

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, MessageContent, GuildVoiceStates],
    partials: [User, Message, GuildMember, ThreadMember, Channel]
})

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

/* 
    Initiate the discord-player for music playback in Discord bots
*/
const { Player } = require('discord-player')

// import extractors to handle various music sources
const { SpotifyExtractor, SoundCloudExtractor, YoutubeExtractor } = require('@discord-player/extractor')

// this is the entrypoint for discord-player based application
client.player = new Player(client, {
    deafenOnJoin: true,
    lagMonitor: 1000,
    ytdlOptions: {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25
    }
})

// register the required extractors
client.player.extractors.register(YoutubeExtractor, {})
client.player.extractors.register(SpotifyExtractor, {})
client.player.extractors.register(SoundCloudExtractor, {})

// import function for edit embed on music channel
const { setMusicReply, updateQueue } = require("./Functions/Music/MusicReply")

// this event is emitted whenever discord-player starts to play a track
client.player.events.on('playerStart', (queue, track) => {
    setMusicReply(client, queue, track)
})

// this event is emitted whenever added multiple songs
client.player.events.on('audioTracksAdd', (queue, track) => {
    if (queue.isPlaying())
        updateQueue(client, queue)
})

// this event is emitted whenever added one song
client.player.events.on('audioTrackAdd', (queue, track) => {
    if (queue.isPlaying())
        updateQueue(client, queue)
})

// this event is emitted whenever bot disconnect from voice channel
client.player.events.on('disconnect', (queue, track) => {
    setMusicReply(client, queue, track)
})

client.player.events.on('error', (queue, error) => console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`))

// log in the client using the bot token
client.login(process.env.BOT_TOKEN).then(() => {
    loadEvents(client);
    loadCommands(client);
    loadComponents(client);
}).catch((err) => console.log(err))