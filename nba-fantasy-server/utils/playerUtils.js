const axios = require('axios');

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
    return null;
  }
}

async function getAdpData() {
  const now = Date.now();
  if (adpCache && (now - adpCacheTimestamp < ADP_CACHE_TTL)) {
    return adpCache;
  }
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
    const adpData = adpResponse.data?.body?.adpList || [];
    adpCache = adpData;
    adpCacheTimestamp = now;
    return adpData;
  } catch (err) {
    console.error('ADP error:', err?.response?.data || err.message);
    return [];
  }
}

async function getProjectionsData(id, numOfDays) {
  const cacheKey = `${id}-${numOfDays}`;
  const now = Date.now();
  const cachedProjection = projectionsCache[cacheKey];
  if (cachedProjection && (now - cachedProjection.timestamp < PROJECTIONS_CACHE_TTL)) {
    return cachedProjection.data;
  }
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
    const projectionData = response.data?.body?.playerProjections;
    const projections = (projectionData && Object.keys(projectionData).length > 0) ? projectionData : null;
    projectionsCache[cacheKey] = {
      data: projections,
      timestamp: now
    };
    return projections;
  } catch (err) {
    console.error(`Projection error for player ${id}:`, {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
    return null;
  }
}

module.exports = {
  calculateFantasyPoints,
  getTeamsData,
  getAdpData,
  getProjectionsData
}; 