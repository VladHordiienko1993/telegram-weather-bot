/**
 * Internationalization messages
 */
const messages = {


  en: {
    greeting: `Hello! 👋

What city/country are you in?

You can either:
📍 Send your GPS location
✍️ Type city name (e.g., "Berlin, Germany")`,

    help: `🤖 Available commands:
/start - Start conversation
/help - Show this help message
/lang - Change language

📍 You can send me:
• Your location (GPS)
• City name (e.g., "Berlin, Germany")`,

    locationButton: '📍 Send my location',
    locationButtonAgain: '📍 Send location again',
    anotherLocation: 'Want to check weather for another location?',
    unknownMessage: 'Sorry, I don\'t understand that. Use /help to see available commands.',
    error: 'Sorry, something went wrong. Please try again.',
    tryAgain: 'Please try again with a different location.',
    cityNotFound: 'City not found. Please check the spelling.',
    weatherUnavailable: 'Unable to fetch weather data',
    sendLocation: 'Please send your location or type a city name.',
    
    // Language selection
    selectLanguage: 'Please select your language:',
    languageChanged: 'Language changed to English! 🇺🇸'
  },


  ru: {
    greeting: `Привет! 👋

В каком городе/стране вы находитесь?

Вы можете:
📍 Отправить GPS локацию
✍️ Написать название города (например, "Берлин, Германия")`,

    help: `🤖 Доступные команды:
/start - Начать диалог
/help - Показать эту справку
/lang - Сменить язык

📍 Вы можете отправить:
• Вашу локацию (GPS)
• Название города (например, "Берлин, Германия")`,

    locationButton: '📍 Отправить мою локацию',
    locationButtonAgain: '📍 Отправить локацию еще раз',
    anotherLocation: 'Хотите проверить погоду в другом месте?',
    unknownMessage: 'Извините, я не понимаю. Используйте /help для просмотра команд.',
    error: 'Извините, что-то пошло не так. Попробуйте еще раз.',
    tryAgain: 'Попробуйте еще раз с другой локацией.',
    cityNotFound: 'Город не найден. Проверьте правильность написания.',
    weatherUnavailable: 'Не удалось получить данные о погоде',
    sendLocation: 'Пожалуйста, отправьте локацию или напишите название города.',
    
    // Language selection
    selectLanguage: 'Пожалуйста, выберите язык:',
    languageChanged: 'Язык изменен на русский! 🇷🇺'
  },


  uk: {
    greeting: `Привіт! 👋

В якому місті/країні ви знаходитесь?

Ви можете:
📍 Відправити GPS локацію
✍️ Написати назву міста (наприклад, "Київ, Україна")`,

    help: `🤖 Доступні команди:
/start - Почати діалог
/help - Показати цю довідку
/lang - Змінити мову

📍 Ви можете відправити:
• Вашу локацію (GPS)
• Назву міста (наприклад, "Київ, Україна")`,

    locationButton: '📍 Відправити мою локацію',
    locationButtonAgain: '📍 Відправити локацію ще раз',
    anotherLocation: 'Бажаєте перевірити погоду в іншому місці?',
    unknownMessage: 'Вибачте, я не розумію. Використовуйте /help для перегляду команд.',
    error: 'Вибачте, щось пішло не так. Спробуйте ще раз.',
    tryAgain: 'Спробуйте ще раз з іншою локацією.',
    cityNotFound: 'Місто не знайдено. Перевірте правильність написання.',
    weatherUnavailable: 'Не вдалося отримати дані про погоду',
    sendLocation: 'Будь ласка, відправте локацію або напишіть назву міста.',
    
    // Language selection
    selectLanguage: 'Будь ласка, оберіть мову:',
    languageChanged: 'Мову змінено на українську! 🇺🇦'
  },


  pl: {
    greeting: `Cześć! 👋

W jakim mieście/kraju się znajdujesz?

Możesz:
📍 Wysłać lokalizację GPS
✍️ Napisać nazwę miasta (np. "Warszawa, Polska")`,

    help: `🤖 Dostępne komendy:
/start - Rozpocznij rozmowę
/help - Pokaż tę pomoc
/lang - Zmień język

📍 Możesz wysłać:
• Swoją lokalizację (GPS)
• Nazwę miasta (np. "Warszawa, Polska")`,

    locationButton: '📍 Wyślij moją lokalizację',
    locationButtonAgain: '📍 Wyślij lokalizację ponownie',
    anotherLocation: 'Chcesz sprawdzić pogodę w innym miejscu?',
    unknownMessage: 'Przepraszam, nie rozumiem. Użyj /help aby zobaczyć komendy.',
    error: 'Przepraszam, coś poszło nie tak. Spróbuj ponownie.',
    tryAgain: 'Spróbuj ponownie z inną lokalizacją.',
    cityNotFound: 'Miasto nie znalezione. Sprawdź pisownię.',
    weatherUnavailable: 'Nie można pobrać danych pogodowych',
    sendLocation: 'Proszę wyślij lokalizację lub wpisz nazwę miasta.',
    
    // Language selection
    selectLanguage: 'Proszę wybierz język:',
    languageChanged: 'Język zmieniony na polski! 🇵🇱'
  }


};


// Import User model for database operations
const User = require('../database/models/User');


/**
 * Get user's language from database
 */
async function getUserLanguage(userId) {
  try {
    return await User.getLanguage(userId);
  } catch (error) {
    return 'en'; // Fallback to English
  }
}


/**
 * Set user's language in database
 */
async function setUserLanguage(userId, language) {
  try {
    if (messages[language]) {
      await User.updateLanguage(userId, language);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}


/**
 * Get translated message
 */
async function getMessage(userId, key, fallback = key) {
  try {
    const language = await getUserLanguage(userId);
    const message = messages[language] && messages[language][key];
    
    return message || messages['en'][key] || fallback;
  } catch (error) {
    return messages['en'][key] || fallback;
  }
}


/**
 * Get available languages
 */
function getAvailableLanguages() {
  return Object.keys(messages);
}


module.exports = {
  getMessage,
  setUserLanguage,
  getUserLanguage,
  getAvailableLanguages
};