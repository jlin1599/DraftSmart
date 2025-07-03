require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route, checks if backend is running, issue with api key, or can frontend access this route?
app.get('/api/test', (req, res) => {
  res.json({ message: 'NBA Fantasy Backend is running!' });
});

// Endpoint to get all active NBA players with season averages
app.get('/api/active-players', async (req, res) => {
  try {
    const response = await axios.get(
      'https://tank01-fantasy-stats.p.rapidapi.com/getNBATeams',
      {
        params: { rosters: 'true', statsToGet: 'averages' },
        headers: {
          'X-RapidAPI-Key': process.env.TANK01_API_KEY,
          'X-RapidAPI-Host': process.env.TANK01_API_HOST,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching active players:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch active players' });
  }
});

app.get('/api/players/compare', async (req, res) => {
  const ids = req.query.ids ? req.query.ids.split(',') : [];
  if (ids.length !== 2) {
    return res.status(400).json({ error: 'Please provide exactly two player IDs as a comma-separated list in the \"ids\" query parameter.' });
  }

  try {
    // Fetch projections for both players in parallel
    const playerProjections = await Promise.all(ids.map(async (id) => {
      // Replace this with the actual Tank01 projections endpoint and parameters
      const response = await axios.get(
        'https://tank01-fantasy-stats.p.rapidapi.com/getNBAProjections',
        {
          params: { playerId: id }, // Adjust param name as needed
          headers: {
            'X-RapidAPI-Key': process.env.TANK01_API_KEY,
            'X-RapidAPI-Host': process.env.TANK01_API_HOST,
          },
        }
      );
      return {
        id,
        projections: response.data,
      };
    }));

    res.json(playerProjections);
  } catch (error) {
    console.error('Error fetching player projections:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch player projections' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 