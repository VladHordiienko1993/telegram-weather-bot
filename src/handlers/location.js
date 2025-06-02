const { getWeatherByCoords, getWeatherByCity } = require('../services/weatherApi');
const { Markup } = require('telegraf');
const logger = require('../utils/logger');
const { getMessage, getUserLanguage } = require('../utils/messages');


module.exports = async (ctx) => {


  const userId = ctx.from.id;


  // Show typing indicator
  await ctx.sendChatAction('typing');


  try {


    let weatherData;
    

    // Get user's language
    const userLanguage = await getUserLanguage(userId);


    // Check if it's GPS location
    if (ctx.message.location) {
      

      const { latitude, longitude } = ctx.message.location;
      logger.info('Processing GPS location request', { latitude, longitude });
      

      weatherData = await getWeatherByCoords(latitude, longitude, userLanguage);


    } else if (ctx.message.text) {
      

      const cityName = ctx.message.text.trim();
      

      // Ignore commands
      if (cityName.startsWith('/')) {
        return;
      }
      

      logger.info('Processing city weather request', { cityName });
      

      weatherData = await getWeatherByCity(cityName, userLanguage);


    } else {
      

      const sendLocationText = await getMessage(userId, 'sendLocation');
      await ctx.reply(sendLocationText);
      return;


    }


    // Remove keyboard and send weather info
    await ctx.reply(
      weatherData.formatted,
      Markup.removeKeyboard()
    );


    // Offer to check another location
    setTimeout(async () => {
      

      const anotherLocationText = await getMessage(userId, 'anotherLocation');
      const locationButtonText = await getMessage(userId, 'locationButtonAgain');
      

      const keyboard = Markup.keyboard([
        Markup.button.locationRequest(locationButtonText)
      ]).resize();
      

      await ctx.reply(anotherLocationText, keyboard);


    }, 2000);


  } catch (error) {
    

    logger.error('Location handler error', { 
      userId: ctx.from?.id,
      username: ctx.from?.username,
      error: error.message 
    });
    

    const tryAgainText = await getMessage(userId, 'tryAgain');
    

    await ctx.reply(
      `${tryAgainText}\n\n${error.message}`,
      Markup.removeKeyboard()
    );


  }


};