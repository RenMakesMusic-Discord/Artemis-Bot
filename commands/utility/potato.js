const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');


//Store cooldowns
    const cooldowns = new Map();

//export command function
    module.exports = {
        data: new SlashCommandBuilder()
            .setName('potato')
            .setDescription('Command that gives a Potato'),
            
            async execute(interaction) {
                const userId = interaction.user.id;
                const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
                // Check if user is in cooldown
                if (cooldowns.has(userId)) {
                    const expirationTime = cooldowns.get(userId);
                    const now = Date.now();
        
                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000; // Convert to seconds
                        const hours = Math.floor(timeLeft / 3600);
                        const minutes = Math.floor((timeLeft % 3600) / 60);
        
                        return interaction.reply({ 
                            content: `Please wait ${hours} hours and ${minutes} minutes before getting another potato!`,
                            ephemeral: true 
                        });
                    }
                }
        
            // Set cooldown
                cooldowns.set(userId, Date.now() + cooldownTime);
        
            // Array of potato images and descriptions
                const potatoes = [
                    { 
                        image: 'https://i.imgur.com/034Pw6l.png',
                        name: 'Regular Potato',
                        description: 'You found a Regular Potato. You must be feeling lucky!'
                    },
                    { 
                        image: 'https://i.imgur.com/MBJMG6L.jpg',
                        name: 'Peeled Potato',
                        description: 'You found a Peeled Potato! You must be feeling unlucky!'
                    },
                    { 
                        image: 'https://i.imgur.com/GtonYl2.jpeg',
                        name: 'Half-Peeled Potato',
                        description: 'You found a Half-Peeled Potato! You must be feeling normal!'
                    },
                    { 
                        image: 'https://i.imgur.com/zaMDFZc.jpeg',
                        name: 'No Potato',
                        description: 'You did not find a Potato! Did you eat it?'
                    }
                ];

            // Generate random number
                const randomIndex = Math.floor(Math.random() * potatoes.length);
                const chosenPotato = potatoes[randomIndex];

            // Create and send embed
                const potatoEmbed = {
                    title: `🥔 ${chosenPotato.name}`,
                    description: chosenPotato.description,
                    color: 0xc4a484,
                    image: {
                        URL: chosenPotato.image
                    },
                    footer: {
                        text: `${interaction.user.username}'s potato`,
                        icon_url: interaction.user.displayAvatarURL()
                    },
                    timestamp: new Date()
                };

                await interaction.reply({ embeds: [potatoEmbed] });
            }
    };


