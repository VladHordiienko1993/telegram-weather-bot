const nock = require('nock');
const { getWeatherByCity, getWeatherByCoords } = require('../src/services/weatherApi');


// Mock environment variables
process.env.WEATHER_API_KEY = 'test-api-key';


describe('Weather API Service', () => {


  afterEach(() => {
    nock.cleanAll();
  });


  test('should get weather by city name', async () => {


    // Mock API response
    const mockResponse = {
      name: 'Berlin',
      sys: { country: 'DE' },
      main: { temp: 15.5 },
      weather: [{ main: 'Clear', description: 'clear sky' }]
    };


    nock('https://api.openweathermap.org')
      .get('/data/2.5/weather')
      .query(true) // Accept any query parameters
      .reply(200, mockResponse);


    const result = await getWeatherByCity('Berlin');


    expect(result.city).toBe('Berlin');
    expect(result.country).toBe('DE');
    expect(result.temperature).toBe(16); // rounded
    expect(result.description).toBe('clear sky');
    expect(result.emoji).toBe('☀️');


  });


  test('should get weather by coordinates', async () => {


    const mockResponse = {
      name: 'London',
      sys: { country: 'GB' },
      main: { temp: 12.3 },
      weather: [{ main: 'Clouds', description: 'overcast clouds' }]
    };


    nock('https://api.openweathermap.org')
      .get('/data/2.5/weather')
      .query(true) // Accept any query parameters
      .reply(200, mockResponse);


    const result = await getWeatherByCoords(51.5074, -0.1278);


    expect(result.city).toBe('London');
    expect(result.temperature).toBe(12);
    expect(result.emoji).toBe('☁️');


  });


  test('should handle city not found error', async () => {


    nock('https://api.openweathermap.org')
      .get('/data/2.5/weather')
      .query(true) // Accept any query parameters
      .reply(404, { message: 'city not found' });


    await expect(getWeatherByCity('NonExistentCity'))
      .rejects
      .toThrow('City not found. Please check the spelling.');


  });


});