const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const config = require('./config.json');


//Command building
module.exports = {
    data: new SlashCommandBuilder()
        .setName('staffapply')
        .setDescription('Apply for staff position'),

    async execute(interaction) {
        try {
            // Initial response in channel
            await interaction.reply({ 
                content: 'I\'ve sent you the application questions in DMs! Please check your messages 📬',
                ephemeral: true 
            });
           // Application questions
            const questions = [
                'What is your age?',
                'What timezone/region are you based in?',
                'Do you have a working microphone?',
                'Why would you like to be on the Rencord staff team?',
                'What would you bring to the staff team?',
                'What do you feel your weaknesses will be when working with the team?',
                'How do you handle stressful situations?',
                'How would you handle a disagreement with a community or staff member?',
                'What is your opinion on the current state of Rencord?',
                'What do you feel like the core role of the Rencord staff team is?',
                'What changes would you make to the server or staff team as it currently is?',
                'Do you have any additional information you would like to share with us? (or put N/A if not)'
            ];
            // Answers array
            const answers = [];
            const dmChannel = await interaction.user.createDM();

            // Send initial message
            await dmChannel.send({
                embeds: [{
                    title: '📝 Staff Application Process',
                    description: 'Please answer each question as it appears. You have 20 minutes to answer each question.\nType "cancel" at any time to cancel the application.',
                    color: 0x2B2D31
                }]
            });

            // Ask questions and collect answers
            for (let i = 0; i < questions.length; i++) {
                await dmChannel.send({
                    embeds: [{
                        description: `**Question ${i + 1}:** ${questions[i]}`,
                        color: 0x2B2D31
                    }]
                });
            //Await response wait time
                try {
                    const filter = m => m.author.id === interaction.user.id;
                    const response = await dmChannel.awaitMessages({
                        filter,
                        max: 1,
                        time: 1200000, 
                        errors: ['time']
                    });

                    const answer = response.first().content;
                    if (answer.toLowerCase() === 'cancel') {
                        await dmChannel.send('Application cancelled.');
                        return;
                    }
                    answers.push(answer);

                } 
            // Timeout error handling
                catch (error) {
                    await dmChannel.send('Application timed out. Please try again.');
                    return;
                }
            }

            // Send application to staff channel
            const staffChannel = interaction.client.channels.cache.get(config.staffchannelid); 
            
            const applicationEmbed = {
                title: '📋 New Staff Application',
                author: {
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL()
                },
                fields: questions.map((question, index) => ({
                    name: question,
                    value: answers[index],
                    inline: false
                })),
                color: 0x2B2D31,
                timestamp: new Date(),
                footer: {
                    text: `Applicant ID: ${interaction.user.id}`
                }
            };
        // Send DM confirmation
            await staffChannel.send({ embeds: [applicationEmbed] });
            await dmChannel.send({
                embeds: [{
                    title: '✅ Application Submitted',
                    description: 'Your application has been submitted successfully! Staff will review it soon.',
                    color: 0x00FF00
                }]
            });

        } 
        // Error handling
        catch (error) {
            console.error(error);
            if (error.code === 50007) {
                await interaction.followUp({ 
                    content: '❌ I couldn\'t send you a DM. Please enable DMs from server members and try again.',
                    ephemeral: true 
                });
            } else {
                await interaction.followUp({   
                    content: '❌ There was an error processing your application.',
                    ephemeral: true 
                });
            }
        }
    }
};

