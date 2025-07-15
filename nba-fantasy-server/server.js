require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory cache for getNBATeams data
let teamsCache = null;
let teamsCacheTimestamp = null;
const TEAMS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

// In-memory cache for projections data
let projectionsCache = {};
const PROJECTIONS_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// In-memory cache for ADP data
let adpCache = null;
let adpCacheTimestamp = null;
const ADP_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours


// Fantasy points calculation function
function calculateFantasyPoints(stats = {}) {
  const pts = parseFloat(stats.pts) || 0;
  const fga = parseFloat(stats.fga) || 0;
  const fgm = parseFloat(stats.fgm) || 0;
  const tptfgm = parseFloat(stats.tptfgm) || 0; // 3PM
  const fta = parseFloat(stats.fta) || 0;
  const ftm = parseFloat(stats.ftm) || 0;
  const reb = parseFloat(stats.reb) || 0;
  const ast = parseFloat(stats.ast) || 0;
  const stl = parseFloat(stats.stl) || 0;
  const blk = parseFloat(stats.blk) || 0;
  const tov = parseFloat(stats.TOV) || 0;
  
  return (
    pts * 1 +
    fga * -1 +
    fgm * 2 +
    tptfgm * 4 +
    fta * -1 +
    ftm * 1 +
    reb * 1 +
    ast * 2 +
    stl * 4 +
    blk * 4 +
    tov * -2
  );
}

async function getTeamsData() {
  const now = Date.now();
  if (teamsCache && (now - teamsCacheTimestamp < TEAMS_CACHE_TTL)) {
    return teamsCache;
  }
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
    teamsCache = response.data;
    teamsCacheTimestamp = now;
    return teamsCache;
  } catch (error) {
    if (error.response) {
      console.error('Error fetching/caching NBA teams data:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else {
      console.error('Error fetching/caching NBA teams data:', error.message);
    }
    // DO NOT update teamsCache or teamsCacheTimestamp on failure!
    return null;
  }
}


// Test route, checks if backend is running, issue with api key, or can frontend access this route?
app.get('/api/test', (req, res) => {
  res.json({ message: 'NBA Fantasy Backend is running!' });
});

// Endpoint to get all active NBA players with season averages
app.get('/api/active-players', async (req, res) => {
  try {
    const teamsData = await getTeamsData();
    res.json(teamsData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active players' });
  }
});


app.get('/api/players/compare', async (req, res) => {
  const ids = req.query.ids ? req.query.ids.split(',') : [];
  const numOfDays = req.query.numOfDays ? parseInt(req.query.numOfDays, 10) : 7;
  if (ids.length !== 2) {
    return res.status(400).json({ error: 'Please provide exactly two player IDs as a comma-separated list in the "ids" query parameter.' });
  }

  try {
    // Get teams data from cache (or fetch if needed)
    const teamsData = await getTeamsData();
    if (!teamsData || !teamsData.body || !Array.isArray(teamsData.body)) {
      return res.status(500).json({ error: 'Failed to fetch NBA teams data for fallback.' });
    }
    // Build a map of playerID -> player object for fast lookup
    const playerMap = {};
    for (const team of teamsData.body) {
      if (team.Roster) {
        for (const [pid, player] of Object.entries(team.Roster)) {
          playerMap[pid] = { ...player, teamName: team.teamName, teamAbv: team.teamAbv };
        }
      }
    }

    // Fetch ADP data once for all players (with caching)
    let adpData = null;
    const now = Date.now();
    
    // Check ADP cache first
    if (adpCache && (now - adpCacheTimestamp < ADP_CACHE_TTL)) {
      adpData = adpCache;
    } else {
      // Fetch fresh ADP data
      try {
        const adpResponse = await axios.get(
          'https://tank01-fantasy-stats.p.rapidapi.com/getNBAADP',
          {
            headers: {
              'X-RapidAPI-Key': process.env.TANK01_API_KEY,
              'X-RapidAPI-Host': process.env.TANK01_API_HOST,
            },
          }
        );
        adpData = adpResponse.data?.body?.adpList || [];
        
        // Cache the ADP data
        adpCache = adpData;
        adpCacheTimestamp = now;
      } catch (err) {
        console.error('ADP error:', err?.response?.data || err.message);
        adpData = [];
      }
    }


    // Create ADP lookup map
    const adpMap = {};
    adpData.forEach(player => {
      adpMap[player.playerID] = {
        overallADP: player.overallADP,
        posADP: player.posADP
      };
    });

    // Fetch projections for both players in parallel
    const playerResults = await Promise.all(ids.map(async (id) => {
      let projections = null;
      
      // Check cache first
      const cacheKey = `${id}-${numOfDays}`;
      const now = Date.now();
      const cachedProjection = projectionsCache[cacheKey];
      
      if (cachedProjection && (now - cachedProjection.timestamp < PROJECTIONS_CACHE_TTL)) {
        projections = cachedProjection.data;
      } else {
        // Fetch fresh projections
        try {
          const response = await axios.get(
            'https://tank01-fantasy-stats.p.rapidapi.com/getNBAProjections',
            {
              params: { playerId: id, numOfDays },
              headers: {
                'X-RapidAPI-Key': process.env.TANK01_API_KEY,
                'X-RapidAPI-Host': process.env.TANK01_API_HOST,
              },
            }
          );
          
          // Validate projection data
          const projectionData = response.data?.body?.playerProjections;
          if (projectionData && Object.keys(projectionData).length > 0) {
            projections = projectionData;
          } else {
            projections = null;
          }
          
          // Cache the projections (including null for offseason)
          projectionsCache[cacheKey] = {
            data: projections,
            timestamp: now
          };
        } catch (err) {
          console.error(`Projection error for player ${id}:`, {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data
          });
          projections = null;
        }
      }
      
      // Get player info and season averages from cache
      const playerInfo = playerMap[id] || null;
      const seasonAverages = playerInfo && playerInfo.stats ? playerInfo.stats : null;
      
      // Extract main stats for comparison
      const mainStats = seasonAverages ? {
        fantasyPoints: calculateFantasyPoints(seasonAverages),
        pts: parseFloat(seasonAverages.pts) || 0,
        reb: parseFloat(seasonAverages.reb) || 0,
        ast: parseFloat(seasonAverages.ast) || 0,
        stl: parseFloat(seasonAverages.stl) || 0,
        blk: parseFloat(seasonAverages.blk) || 0,
        TOV: parseFloat(seasonAverages.TOV) || 0
      } : null;
      
      // Get ADP data for this player
      const adp = adpMap[id] || null;
      
      // Get injury data for this player from their playerInfo
      const playerInjuries = playerInfo?.injury ? [playerInfo.injury] : [];
      
      return {
        id,
        playerInfo,
        projections,
        mainStats,
        adp,
        injuries: playerInjuries,
      };
    }));

    res.json(playerResults);
  } catch (error) {
    console.error('Error in compare endpoint:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to compare players' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 