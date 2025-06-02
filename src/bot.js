require('dotenv').config();
const { Telegraf } = require('telegraf');
const logger = require('./utils/logger');


// Check environment variables
if (!process.env.BOT_TOKEN) {
  logger.error('BOT_TOKEN not found in environment variables');
  process.exit(1);
}

if (!process.env.WEATHER_API_KEY) {
  logger.error('WEATHER_API_KEY not found in environment variables'); 
  process.exit(1);
}


const startHandler = require('./handlers/start');
const locationHandler = require('./handlers/location');
const { showLanguageMenu, handleLanguageSelection } = require('./handlers/language');
const { getMessage } = require('./utils/messages');


const bot = new Telegraf(process.env.BOT_TOKEN);


// Commands
bot.start(startHandler);
bot.command('lang', showLanguageMenu);


// Help command
bot.help(async (ctx) => {
  const userId = ctx.from.id;
  const helpText = await getMessage(userId, 'help');
  ctx.reply(helpText);
});


// Callback queries (for inline buttons)
bot.on('callback_query', handleLanguageSelection);


// Location handlers
bot.on('location', locationHandler);
bot.on('text', locationHandler);


// Handle unknown commands
bot.on('message', async (ctx) => {


  const userId = ctx.from.id;
  const unknownText = await getMessage(userId, 'unknownMessage');
  ctx.reply(unknownText);


});


// Error handling
bot.catch(async (err, ctx) => {
  logger.error(`Bot error for ${ctx.updateType}`, err);
  const userId = ctx.from?.id;
  if (userId) {
    const errorText = await getMessage(userId, 'error');
    ctx.reply(errorText);
  } else {
    ctx.reply('Sorry, something went wrong. Please try again.');
  }
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