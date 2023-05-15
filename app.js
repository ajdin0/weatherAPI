const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const https = require('https');

require('dotenv').config();

app.use(bodyParser.urlencoded({extended:true}));

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Define your API endpoints here

app.use(express.json());

app.get('/weather/current/:location', async (req, res) => {
    const url= `https://api.openweathermap.org/data/2.5/weather?q=${req.params.location}&appid=${process.env.API_KEY}&units=metric`;
    try {
        const response = await axios.get(url);
        res.setHeader('Content-Type', 'application/json');
        res.json(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        res.status(400).json({ message: "Invalid location. Please enter a valid location." });
      } else {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
      }
    }
});

app.get('/weather/forecast/:location', async (req, res) => {
  const location = req.params.location;
  const hours = req.query.hours || 3;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.API_KEY}&units=metric&cnt=${hours}`;
    try {
        const response = await axios.get(url);
        res.setHeader('Content-Type', 'application/json');
        res.json(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        res.status(400).json({ message: "Invalid location. Please enter a valid location." });
      } else {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
      }
    }
});

app.get('/weather/history/:location', async (req, res) => {
  const location = req.params.location;
  const date = req.query.date;
  const unixTime = Math.round(new Date(date).getTime() / 1000);

  const url = `https://api.openweathermap.org/data/2.5/onecall/timemachine?q=${location}&dt=${unixTime}&appid=${process.env.API_KEY}&units=metric`;
  
  try {
    const response = await axios.get(url);
    res.setHeader('Content-Type', 'application/json');
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(400).json({ message: "Invalid location. Please enter a valid location." });
    } else {
      console.error(error);
      res.status(500).json({ message: "Something went wrong." });
    }
  }
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
