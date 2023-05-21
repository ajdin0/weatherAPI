const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const https = require('https');
const NodeCache = require('node-cache');
const auth = require('basic-auth');

require('dotenv').config();

const cache = new NodeCache({ stdTTL: 300 });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function logMessage(level, message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

app.use((req, res, next) => {
  const key = req.originalUrl;
  const cachedData = cache.get(key);
  if (cachedData) {
    const { data, provider, lastRefreshed } = cachedData;
    const timeSinceLastRefresh = Math.floor((Date.now() - lastRefreshed) / 1000);
    res.setHeader('X-Weather-Provider', provider);
    res.setHeader('X-Last-Refreshed', `${timeSinceLastRefresh}s ago`);
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
  } else {
    res.sendResponse = res.send;
    res.send = async (body) => {
      cache.set(key, {
        data: body,
        provider: 'OpenWeatherMap',
        lastRefreshed: Date.now()
      });
      res.sendResponse(body);
    };
    next();
  }
});

// User Authentication
function checkCredentials(username, password) {
  if (!process.env.username || !process.env.password) {
    throw new Error('USERNAME or PASSWORD not set correctly');
  }
  return username === process.env.username && password === process.env.password;
}

const authMiddleware = (req, res, next) => {
  if (process.env.AUTHENTICATION == 'true') {
    const credentials = auth(req);
    logMessage('debug', 'Authentication Middleware - Checking credentials...');

    if (!credentials || !checkCredentials(credentials.name, credentials.pass)) {
      logMessage('warn', 'Authentication failed');
      res.status(401).set('WWW-Authenticate', 'Basic realm="Authentication Required"').send('Unauthorized');
    } else {
      logMessage('debug', 'Authentication successful');
      next();
    }
  }
};

// Define API endpoints here
app.use(express.json());

app.get('/weather/current/:location', authMiddleware, async (req, res) => {
  const location = req.params.location;
  logMessage('info', `Fetching current weather for location: ${location}`);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.API_KEY}&units=metric`;
  try {
    const response = await axios.get(url);
    res.setHeader('Content-Type', 'application/json');
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logMessage('error', 'Invalid location. Please enter a valid location.');
      res.status(400).json({ message: "Invalid location. Please enter a valid location." });
    } else {
      logMessage('error', 'Something went wrong.');
      console.error(error);
      res.status(500).json({ message: "Something went wrong." });
    }
  }
});

app.get('/weather/forecast/:location', authMiddleware, async (req, res) => {
  const location = req.params.location;
  const hours = req.query.hours || 3;
  logMessage('info', `Fetching weather forecast for location: ${location}, hours: ${hours}`);

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.API_KEY}&units=metric&cnt=${hours}`;
  try {
    const response = await axios.get(url);
    res.setHeader('Content-Type', 'application/json');
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logMessage('error', 'Invalid location. Please enter a valid location.');
      res.status(400).json({ message: "Invalid location. Please enter a valid location." });
    } else {
      logMessage('error', 'Something went wrong.');
      console.error(error);
      res.status(500).json({ message: "Something went wrong." });
    }
  }
});

app.get('/weather/history/:location', authMiddleware, async (req, res) => {
  const location = req.params.location;
  const date = req.query.date;
  const unixTime = Math.round(new Date(date).getTime() / 1000);
  logMessage('info', `Fetching weather history for location: ${location}, date: ${date}`);

  const url = `https://api.openweathermap.org/data/2.5/onecall/timemachine?q=${location}&dt=${unixTime}&appid=${process.env.API_KEY}&units=metric`;
  try {
    const response = await axios.get(url);
    res.setHeader('Content-Type', 'application/json');
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logMessage('error', 'Invalid location. Please enter a valid location.');
      res.status(400).json({ message: "Invalid location. Please enter a valid location." });
    } else {
      logMessage('error', 'Something went wrong.');
      console.error(error);
      res.status(500).json({ message: "Something went wrong." });
    }
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logMessage('info', `Server running on port ${PORT}`));
