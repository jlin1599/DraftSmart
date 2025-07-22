const axios = require('axios');

// Import or define any shared cache/utility functions as needed
const { calculateFantasyPoints, getTeamsData, getAdpData, getProjectionsData } = require('../utils/playerUtils');

async function comparePlayers(req, res) {
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

    // Fetch ADP data
    const adpData = await getAdpData();
    const adpMap = {};
    adpData.forEach(player => {
      adpMap[player.playerID] = {
        overallADP: player.overallADP,
        posADP: player.posADP
      };
    });

    // Fetch projections for both players in parallel
    const playerResults = await Promise.all(ids.map(async (id) => {
      const projections = await getProjectionsData(id, numOfDays);
      const playerInfo = playerMap[id] || null;
      const seasonAverages = playerInfo && playerInfo.stats ? playerInfo.stats : null;
      const mainStats = seasonAverages ? {
        fantasyPoints: calculateFantasyPoints(seasonAverages),
        pts: parseFloat(seasonAverages.pts) || 0,
        reb: parseFloat(seasonAverages.reb) || 0,
        ast: parseFloat(seasonAverages.ast) || 0,
        stl: parseFloat(seasonAverages.stl) || 0,
        blk: parseFloat(seasonAverages.blk) || 0,
        TOV: parseFloat(seasonAverages.TOV) || 0
      } : null;
      const adp = adpMap[id] || null;
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
}

module.exports = { comparePlayers }; 