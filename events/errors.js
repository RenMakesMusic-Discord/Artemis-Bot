const { Events } = require('discord.js');

module.exports = {
    name: Events.Error,
    execute(error) {
        console.log(`Artemis Bot error: ${error}`);
    },
};