const { Markup } = require('telegraf');
const { getMessage, setUserLanguage } = require('../utils/messages');
const logger = require('../utils/logger');


/**
 * Handle /lang command - show language selection
 */
async function showLanguageMenu(ctx) {


  const userId = ctx.from.id;


  try {
    

    const selectLanguageText = await getMessage(userId, 'selectLanguage');


    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('🇺🇸 English', 'lang_en'),
        Markup.button.callback('🇷🇺 Русский', 'lang_ru')
      ],
      [
        Markup.button.callback('🇺🇦 Українська', 'lang_uk'),
        Markup.button.callback('🇵🇱 Polski', 'lang_pl')
      ]
    ]);


    await ctx.reply(selectLanguageText, keyboard);


  } catch (error) {
    

    logger.error('Error showing language menu', { userId, error: error.message });
    

    // Fallback to English
    await ctx.reply('Please select your language:', 
      Markup.inlineKeyboard([
        [
          Markup.button.callback('🇺🇸 English', 'lang_en'),
          Markup.button.callback('🇷🇺 Русский', 'lang_ru')
        ],
        [
          Markup.button.callback('🇺🇦 Українська', 'lang_uk'),
          Markup.button.callback('🇵🇱 Polski', 'lang_pl')
        ]
      ])
    );


  }


}


/**
 * Handle language selection callback
 */
async function handleLanguageSelection(ctx) {


  const userId = ctx.from.id;
  const selectedLang = ctx.callbackQuery.data.replace('lang_', '');


  try {
    

    // Set user language in database
    const success = await setUserLanguage(userId, selectedLang);
    

    if (success) {
      

      // Send confirmation in new language
      const confirmationText = await getMessage(userId, 'languageChanged');
      

      await ctx.editMessageText(confirmationText);
      

      // Show start message in new language after 1.5 seconds
      setTimeout(async () => {
        try {
          const startHandler = require('./start');
          await startHandler(ctx);
        } catch (error) {
          logger.error('Error calling start handler after language change', { 
            userId, 
            selectedLang,
            error: error.message 
          });
        }
      }, 1500);


    } else {
      

      logger.warn('Language selection failed', { userId, selectedLang });
      await ctx.answerCbQuery('❌ Language selection failed');


    }


  } catch (error) {
    

    logger.error('Error setting language', { 
      userId, 
      selectedLang,
      error: error.message 
    });
    
    await ctx.answerCbQuery('❌ Error occurred');


  }


}


module.exports = {
  showLanguageMenu,
  handleLanguageSelection
};