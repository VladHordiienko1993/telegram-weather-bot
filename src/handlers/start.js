const { Markup } = require('telegraf');
const { getMessage } = require('../utils/messages');
const User = require('../database/models/User');
const logger = require('../utils/logger');


module.exports = async (ctx) => {


  const userId = ctx.from.id;
  const { username, first_name, last_name } = ctx.from;


  try {
    

    // Create or update user in database
    await User.createOrUpdate({
      userId,
      username,
      firstName: first_name,
      lastName: last_name
    });


  } catch (error) {
    

    // Log error but continue - don't block user experience
    logger.error('Error saving user to database', { 
      userId, 
      username,
      error: error.message 
    });


  }


  try {
    

    const welcomeMessage = await getMessage(userId, 'greeting');
    const locationButtonText = await getMessage(userId, 'locationButton');


    const keyboard = Markup.keyboard([
      Markup.button.locationRequest(locationButtonText)
    ]).resize();


    await ctx.reply(welcomeMessage, keyboard);


  } catch (error) {
    

    logger.error('Error in start handler', { userId, error: error.message });
    

    // Fallback to English if translations fail
    await ctx.reply(`Hello! 👋\n\nWhat city/country are you in?\n\nYou can either:\n📍 Send your GPS location\n✍️ Type city name (e.g., "Berlin, Germany")`,
      Markup.keyboard([
        Markup.button.locationRequest('📍 Send my location')
      ]).resize()
    );


  }


};