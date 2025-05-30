require('dotenv').config();
const { Telegraf } = require('telegraf');
const logger = require('./utils/logger');


// Check environment variables
logger.debug('Checking environment variables');
logger.debug('BOT_TOKEN loaded', { hasToken: !!process.env.BOT_TOKEN });
logger.debug('WEATHER_API_KEY loaded', { hasKey: !!process.env.WEATHER_API_KEY });

if (!process.env.BOT_TOKEN) {
  logger.error('BOT_TOKEN not found in environment variables');
  process.exit(1);
}


const startHandler = require('./handlers/start');
const locationHandler = require('./handlers/location');


const bot = new Telegraf(process.env.BOT_TOKEN);


// Start command
bot.start(startHandler);


// Help command
bot.help((ctx) => {
  ctx.reply(`
🤖 Available commands:
/start - Start conversation
/help - Show this help message

📍 You can send me:
• Your location (GPS)
• City name (e.g., "Berlin, Germany")
  `);
});


// Location handlers
bot.on('location', locationHandler);
bot.on('text', locationHandler);


// Handle unknown commands
bot.on('message', (ctx) => {


  ctx.reply('Sorry, I don\'t understand that. Use /help to see available commands.');


});


// Error handling
bot.catch((err, ctx) => {
  logger.error(`Bot error for ${ctx.updateType}`, err);
  ctx.reply('Sorry, something went wrong. Please try again.');
});


// Start bot
logger.info('Starting Telegram bot...');

bot.launch()
  .then(() => {
    logger.info('Bot started successfully and is waiting for messages');
  })
  .catch((err) => {
    logger.error('Failed to start bot', err);
    process.exit(1);
  });


// Graceful stop
process.once('SIGINT', () => {
  logger.info('Received SIGINT, stopping bot gracefully...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  logger.info('Received SIGTERM, stopping bot gracefully...');
  bot.stop('SIGTERM');
});