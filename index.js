const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const SEARCH_FILE = './searches.json';
const MAX_HISTORY = 5;

// Map weather codes to description and emoji icons
const weatherMap = {
  0: { desc: 'Clear sky', icon: '☀️' },
  1: { desc: 'Mainly clear', icon: '🌤️' },
  2: { desc: 'Partly cloudy', icon: '⛅' },
  3: { desc: 'Overcast', icon: '☁️' },
  45: { desc: 'Fog', icon: '🌫️' },
  48: { desc: 'Depositing rime fog', icon: '🌫️' },
  51: { desc: 'Drizzle: Light', icon: '🌦️' },
  53: { desc: 'Drizzle: Moderate', icon: '🌦️' },
  55: { desc: 'Drizzle: Dense', icon: '🌧️' },
  56: { desc: 'Freezing Drizzle: Light', icon: '🌧️' },
  57: { desc: 'Freezing Drizzle: Dense', icon: '🌧️' },
  61: { desc: 'Rain: Slight', icon: '🌧️' },
  63: { desc: 'Rain: Moderate', icon: '🌧️' },
  65: { desc: 'Rain: Heavy', icon: '🌧️' },
  66: { desc: 'Freezing Rain: Light', icon: '🌨️' },
  67: { desc: 'Freezing Rain: Heavy', icon: '🌨️' },
  71: { desc: 'Snow: Slight', icon: '❄️' },
  73: { desc: 'Snow: Moderate', icon: '❄️' },
  75: { desc: 'Snow: Heavy', icon: '❄️' },
  77: { desc: 'Snow grains', icon: '❄️' },
  80: { desc: 'Rain showers: Slight', icon: '🌧️' },
  81: { desc: 'Rain showers: Moderate', icon: '🌧️' },
  82: { desc: 'Rain showers: Violent', icon: '🌧️' },
  85: { desc: 'Snow showers: Slight', icon: '❄️' },
  86: { desc: 'Snow showers: Heavy', icon: '❄️' },
  95: { desc: 'Thunderstorm: Slight or moderate', icon: '⛈️' },
  96: { desc: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { desc: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

// Helper to read/write search history
const readHistory = () => {
  try {
    return JSON.parse(fs.readFileSync(SEARCH_FILE));
  } catch {
    return [];
  }
};

const writeHistory = (history) => {
  fs.writeFileSync(SEARCH_FILE, JSON.stringify(history.slice(0, MAX_HISTORY)));
};

// Calculate approximate city time from longitude
const getCityTimeOffset = (longitude) => {
  return longitude / 15; // hours offset from UTC
};

// Home page
app.get('/', (req, res) => {
  const history = readHistory();
  res.render('index', { weather: null, error: null, history });
});

// Form submission
app.post('/', async (req, res) => {
  const city = req.body.city.trim();
  const history = readHistory();

  try {
    // Get latitude & longitude using Open-Meteo geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
    const geoRes = await axios.get(geoUrl);

    if (!geoRes.data.results) throw new Error('City not found');

    const { latitude, longitude, name, country } = geoRes.data.results[0];

    // Get current weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherRes = await axios.get(weatherUrl);
    const weather = weatherRes.data.current_weather;

    // Calculate city UTC offset using longitude
    const utc_offset = getCityTimeOffset(longitude);

    // Prepare readable weather data
    const weatherData = {
      ...weather,
      name,
      country,
      description: weatherMap[weather.weathercode]?.desc || 'Unknown',
      icon: weatherMap[weather.weathercode]?.icon || '❓',
      tempC: weather.temperature,
      tempF: (weather.temperature * 9/5 + 32).toFixed(1),
      utc_offset
    };

    // Update search history
    if (!history.includes(name)) history.unshift(name);
    writeHistory(history);

    res.render('index', { weather: weatherData, error: null, history: readHistory() });
  } catch (err) {
    res.render('index', { weather: null, error: err.message, history });
  }
});

// Listen on all IPs for EC2
app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));

