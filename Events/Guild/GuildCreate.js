const { Guild, Client } = require("discord.js")
const { promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)

module.exports = {
    name: "guildCreate",
    /**
     * 
     * @param {Guild} guild 
     * @param {Client} client 
     */
    async execute(guild, client) {
        CommandsArray = [];

        (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async (file) => {
            const command = require(file);

            client.commands.set(command.name, command);
            CommandsArray.push(command);
        });

        guild.commands.set(CommandsArray).then(async (command) => {
            const Roles = (commandName) => {
                const cmdPerms = CommandsArray.find((c) => c.name === commandName).permission;
                if (!cmdPerms) return null;

                return guild.roles.cache.filter((r) => r.permissions.has(cmdPerms)).first(10);
            }

            const fullPermissions = command.reduce((accumulator, r) => {
                const roles = Roles(r.name);
                if (!roles) return accumulator;

                const permissions = roles.reduce((a, r) => {
                    return [...a, { id: r.id, type: "ROLE", permission: true }]
                }, []);

                return [...accumulator, { id: r.id, permissions }]
            }, [])

            // await guild.commands.permissions.set({ fullPermissions });
        })
    }
}