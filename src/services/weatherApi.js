const axios = require('axios');
const logger = require('../utils/logger');


const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = process.env.WEATHER_API_KEY;


/**
 * Get weather by coordinates
 */
async function getWeatherByCoords(lat, lon) {


  try {


    const response = await axios.get(BASE_URL, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric' // Celsius
      }
    });


    return formatWeatherData(response.data);


  } catch (error) {
    logger.error('Weather API request failed (coordinates)', { 
      lat, 
      lon, 
      error: error.message 
    });
    throw new Error('Unable to fetch weather data');
  }


}


/**
 * Get weather by city name
 */
async function getWeatherByCity(cityName) {


  try {


    const response = await axios.get(BASE_URL, {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric'
      }
    });


    return formatWeatherData(response.data);


  } catch (error) {
    
    
    if (error.response && error.response.status === 404) {
      logger.warn('City not found in weather API', { cityName });
      throw new Error('City not found. Please check the spelling.');
    }
    
    
    logger.error('Weather API request failed (city)', { 
      cityName, 
      error: error.message 
    });
    throw new Error('Unable to fetch weather data');


  }


}


/**
 * Format weather data for user-friendly display
 */
function formatWeatherData(data) {


  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const cityName = data.name;
  const country = data.sys.country;


  // Weather emoji mapping
  const weatherEmoji = getWeatherEmoji(data.weather[0].main);


  return {
    temperature: temp,
    description: description,
    city: cityName,
    country: country,
    emoji: weatherEmoji,
    formatted: `${weatherEmoji} ${temp}°C, ${description}\n📍 ${cityName}, ${country}`
  };


}


/**
 * Get appropriate emoji for weather condition
 */
function getWeatherEmoji(weatherMain) {


  const emojiMap = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  };


  return emojiMap[weatherMain] || '🌤️';


}


module.exports = {
  getWeatherByCoords,
  getWeatherByCity
};