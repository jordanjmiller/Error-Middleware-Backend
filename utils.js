const axios = require('axios');
const functionFile = 'utils.js';

const slackMessage = (channel, message) => {
    let url = ''
    switch (channel){
        case `Error`: url = process.env.slackErrorUrl; break;
        default: url = process.env.slackErrorUrl;
    }

    axios.post(url, {text: message})
    .then(response => { })
    .catch(err => { console.log("slackMessage error:", err); });
}
const discordMessage = (channel, message) => {
    let url = ''
    switch (channel){
        case `Error`: url = process.env.discordErrorUrl; break;
        case `Bug`: url = process.env.discordBugUrl; break;
        case `Sugg`: url = process.env.discordSuggUrl; break;
        default: url = process.env.discordErrorUrl;
    }

    axios.post(url, {content: message})
    .then(response => { })
    .catch(err => { console.log("discordMessage error:", err); });
}

module.exports = { slackMessage, discordMessage }