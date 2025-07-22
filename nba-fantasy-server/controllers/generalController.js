const { getTeamsData } = require('../utils/playerUtils');

function test(req, res) {
  res.json({ message: 'NBA Fantasy Backend is running!' });
}

async function activePlayers(req, res) {
  try {
    const teamsData = await getTeamsData();
    res.json(teamsData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active players' });
  }
}

module.exports = { test, activePlayers }; 