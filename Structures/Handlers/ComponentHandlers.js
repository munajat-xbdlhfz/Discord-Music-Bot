function loadComponents(client) {
    const ascii = require("ascii-table");
    const fs = require("fs");
    const table = new ascii().setHeading("Components", "Status");

    const componentsFolders = fs.readdirSync("./Components");
    for (const folder of componentsFolders) {
        const componentsFiles = fs
            .readdirSync(`./Components/${folder}`)
            .filter((file) => file.endsWith(".js"));

        switch (folder) {
            case "Buttons": {
                for (const file of componentsFiles) {
                    const button = require(`../../Components/${folder}/${file}`);
                    client.buttons.set(button.data.name, button);

                    table.addRow(file, "🟩 READY!");
                    continue;
                }
            }
            break;

            case "SelectMenus": {
                for (const file of componentsFiles) {
                    const menu = require(`../../Components/${folder}/${file}`);
                    client.selectMenus.set(menu.data.name, menu);

                    table.addRow(file, "🟩 READY!");
                    continue;
                }
            }
            break;

            case "Modals": {
                for (const file of componentsFiles) {
                    const modal = require(`../../Components/${folder}/${file}`);
                    client.modals.set(modal.data.name, modal);

                    table.addRow(file, "🟩 READY!");
                    continue;
                }
            }
            break;
        }
    }

    return console.log(table.toString(), "\nLoaded Components.");
}

module.exports = { loadComponents };