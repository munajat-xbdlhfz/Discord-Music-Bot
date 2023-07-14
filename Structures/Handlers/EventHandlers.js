const loadEvents = (client) => {
    let ascii = require('ascii-table')
    let fs = require('fs')
    let table = new ascii().setHeading('Events', 'Status')

    let folders = fs.readdirSync('./Events')
    for (let folder of folders) {
        let files = fs
            .readdirSync(`./Events/${folder}`)
            .filter((file) => file.endsWith('js'))

        for (let file of files) {
            let event = require(`../../Events/${folder}/${file}`)

            if (event.rest) {
                if (event.once)
                    client.rest.once(event.name, (...args) => event.execute(...args, client))
                else
                    client.rest.on(event.name, (...args) => event.execute(...args, client))
            } else {
                if (event.once)
                    client.once(event.name, (...args) => event.execute(...args, client))
                else
                    client.on(event.name, (...args) => event.execute(...args, client))
            }

            table.addRow(file, '🟩 READY!')
            continue
        }
    }

    return console.log(table.toString(), '\nLoaded Events.')
}

module.exports = { loadEvents }