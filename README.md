# DISCORD MUSIC BOT
A Discord Music Bot with Slash Commands and easy to use. Support Youtube, Spotify, SoundCloud.

## Install Dependencies
This bot is using discord.js v13 and requires Node 16.6 or higher to use.
```
npm i discord.js
npm i dotenv
npm i glob
npm i ascii-table
npm i mongoose
npm i canvas
npm i ytdl-core
npm i yt-search
npm i libsodium-wrappers
npm i ffmpeg-static
npm i distube
npm i @discordjs/opus
npm i @distube/yt-dlp
npm i @distube/spotify
npm i @distube/soundcloud
```

## Create .env File
This bot is using .env, make sure you create your own .env file to use all function of this bot just like bellow.
```
BOT_TOKEN = your bot token
DATABASE_URL = your mongoDB url
```

## How To Use Music Command
First use music settings slash command and pick Create Music Channel options. After music channel created, message the song name or just paste a link url (Youtube, Spotify, SoundCloud url).
![alt text](https://cdn.discordapp.com/attachments/914492895791308830/961015503537717279/unknown.png)

## Discord Music Bot Display
When there is no song playing or no queue:
![alt text](https://cdn.discordapp.com/attachments/872110032689459241/955369751272620032/unknown.png)

When playing a song:
![alt text](https://cdn.discordapp.com/attachments/872110032689459241/955370525151096862/unknown.png)