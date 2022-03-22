const client = require("../main")
let timeoutID;

const setLeaveTimeout = (VoiceChannel) => {
    timeoutID = setTimeout(() => {
        client.distube.voices.get(VoiceChannel)?.leave()
    }, 2 * 60 * 1000)
}

const clearLeaveTimeout = () => {
    clearTimeout(timeoutID)
    timeoutID = undefined
}

module.exports = {
    setLeaveTimeout,
    clearLeaveTimeout,
}