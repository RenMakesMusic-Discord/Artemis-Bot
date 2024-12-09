const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

//export command function
module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestions')
        .setDescription('Suggestions for the server')
        .addStringOption(option => 
            option.setName('followup')
                .setDescription('Do you want staff to update you about the suggestion?')
                .setRequired(true)
                .addChoices(
                    { name: 'Yes', value: 'yes' },
                    { name: 'No', value: 'no' }
                )
            )
        .addStringOption(option => 
            option.setName('anonymous')
                .setDescription('Do you want the suggestion to be anonymous?')
                .setRequired(true)
                .addChoices(
                    { name: 'Yes', value: 'yes' },
                    { name: 'No', value: 'no' }
                )
            )
        .addStringOption(option =>
            option.setName('suggestion')
                .setDescription('The suggestion to send')
                .setRequired(true)
                .setMaxLength(1024)
            ),
    
    //execute command
    async execute(interaction) {
        const willFollowup = interaction.options.getString('followup') === 'yes';
        const isAnonymous = interaction.options.getString('anonymous') === 'yes';
        const suggestion = interaction.options.getString('suggestion');

        //define suggestions channel
        const suggestionsChannel = interaction.client.channels.cache.get(config.suggestionschannelid);

        //check if suggestions channel exists and reply to user if not
        if (!suggestionsChannel) {
            return interaction.reply({ content: 'Could not find suggestions channel!', ephemeral: true });
        }

        //check if suggestion is too long and reply to user if it is
        if (suggestion.length > 1024) {
            return interaction.reply({ content: 'Suggestion is too long!', ephemeral: true });
        }

        //generate author and followup text
        const authorText = isAnonymous ? 'Anonymous' : interaction.user.tag;
        const followupText = willFollowup ? 'Yes' : 'No';
    
        //create embed and send to channel
        const embedData = {
            title: 'Suggestion',
            color: 0x0345fc,
            thumbnail: {
                url: 'https://i.imgur.com/KitClWJ.png'
            },
            author: {
                name: 'Anonymous',
                iconURL: 'https://i.imgur.com/yfi8hzc.png'
            },
            fields: [
                {
                    name: 'Follow-up',
                    value: followupText
                },
                {
                    name: 'Suggestion',
                    value: suggestion
                },
            ],
            timestamp: new Date()
        };

        // Check if post is older than 5 days
        const postDate = new Date();
        const fiveDaysAgo = new Date(postDate - (5 * 24 * 60 * 60 * 1000));
        
        if (postDate < fiveDaysAgo) {
            embedData.footer = {
                text: 'Older Post 📜'
            };
        }

        //check if post is anonymous
        if (!isAnonymous) {
            embedData.author = {
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            };
        }
        //send embed to suggestions channel
        const sentMessage = await suggestionsChannel.send({ embeds: [embedData] });

        // Remove thumbnail after 1 day
        setTimeout(() => {
            embedData.thumbnail = null;
            sentMessage.edit({ embeds: [embedData] });
        }, 86400000);

        //send user only reply to user
        await interaction.reply({ content: 'Suggestion sent!', ephemeral: true });
    }
};