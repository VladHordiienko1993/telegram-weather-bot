const { getWeatherByCoords, getWeatherByCity } = require('../services/weatherApi');
const { Markup } = require('telegraf');
const logger = require('../utils/logger');


module.exports = async (ctx) => {


  // Show typing indicator
  await ctx.sendChatAction('typing');


  try {


    let weatherData;


    // Check if it's GPS location
    if (ctx.message.location) {
      

      const { latitude, longitude } = ctx.message.location;
      logger.info('Processing GPS location request', { latitude, longitude });
      

      weatherData = await getWeatherByCoords(latitude, longitude);


    } else if (ctx.message.text) {
      

      const cityName = ctx.message.text.trim();
      

      // Ignore commands
      if (cityName.startsWith('/')) {
        return;
      }
      

      logger.info('Processing city weather request', { cityName });
      

      weatherData = await getWeatherByCity(cityName);


    } else {
      

      await ctx.reply('Please send your location or type a city name.');
      return;


    }


    // Remove keyboard and send weather info
    await ctx.reply(
      weatherData.formatted,
      Markup.removeKeyboard()
    );


    // Offer to check another location
    setTimeout(async () => {
      

      const keyboard = Markup.keyboard([
        Markup.button.locationRequest('📍 Send location again')
      ]).resize();
      

      await ctx.reply('Want to check weather for another location?', keyboard);


    }, 2000);


  } catch (error) {
    

    logger.error('Location handler error', { 
      userId: ctx.from?.id,
      username: ctx.from?.username,
      error: error.message 
    });
    

    await ctx.reply(
      `Sorry, ${error.message}\n\nPlease try again with a different location.`,
      Markup.removeKeyboard()
    );


  }


};