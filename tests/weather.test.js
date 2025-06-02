const nock = require('nock');
const { getWeatherByCity, getWeatherByCoords } = require('../src/services/weatherApi');


// Mock environment variables
process.env.WEATHER_API_KEY = 'test-api-key';


describe('Weather API Service', () => {


  afterEach(() => {
    nock.cleanAll();
  });


  test('should get weather by city name with language support', async () => {


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


    const result = await getWeatherByCity('Berlin', 'en');


    expect(result.city).toBe('Berlin');
    expect(result.country).toBe('DE');
    expect(result.temperature).toBe(16); // rounded
    expect(result.description).toBe('clear sky');
    expect(result.emoji).toBe('☀️');
    expect(result.formatted).toContain('Berlin, DE');


  });


  test('should get weather by coordinates with language support', async () => {


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


    const result = await getWeatherByCoords(51.5074, -0.1278, 'en');


    expect(result.city).toBe('London');
    expect(result.temperature).toBe(12);
    expect(result.emoji).toBe('☁️');
    expect(result.formatted).toContain('London, GB');


  });


  test('should handle city not found error', async () => {


    nock('https://api.openweathermap.org')
      .get('/data/2.5/weather')
      .query(true) // Accept any query parameters
      .reply(404, { message: 'city not found' });


    await expect(getWeatherByCity('NonExistentCity', 'en'))
      .rejects
      .toThrow('City not found. Please check the spelling.');


  });


  test('should use default language when not specified', async () => {


    const mockResponse = {
      name: 'Paris',
      sys: { country: 'FR' },
      main: { temp: 18.7 },
      weather: [{ main: 'Rain', description: 'light rain' }]
    };


    nock('https://api.openweathermap.org')
      .get('/data/2.5/weather')
      .query(true)
      .reply(200, mockResponse);


    // Test without language parameter (should default to 'en')
    const result = await getWeatherByCity('Paris');


    expect(result.city).toBe('Paris');
    expect(result.temperature).toBe(19);
    expect(result.emoji).toBe('🌧️');


  });


});