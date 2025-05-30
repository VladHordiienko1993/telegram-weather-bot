const { Markup } = require('telegraf');


module.exports = async (ctx) => {


  const welcomeMessage = `Hello! 👋

What city/country are you in?

You can either:
📍 Send your GPS location
✍️ Type city name (e.g., "Berlin, Germany")`;


  // Keyboard with location button
  const keyboard = Markup.keyboard([
    Markup.button.locationRequest('📍 Send my location')
  ]).resize();


  await ctx.reply(welcomeMessage, keyboard);


};