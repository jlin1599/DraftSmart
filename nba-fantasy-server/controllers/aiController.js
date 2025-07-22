const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function getAiSummary(req, res) {
  const { player1, player2 } = req.body;
  if (!player1 || !player2) {
    return res.status(400).json({ error: 'Both player1 and player2 data are required.' });
  }
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured.' });
  }

  // More open-ended, analytical prompt for better AI summaries
  const prompt =
    `You are a fantasy basketball expert. Analyze and compare the following two NBA players for a fantasy basketball manager. Consider their age(players usually decline production after 30 and increase injury risk), ADP (average draft position), projected points, Position ADP, main stats, and injury history. Highlight strengths, weaknesses, and who is the better pick in a standard league. Be concise (2-3 sentences, no more than 120 words).\n\n` +
    `Player 1: ${player1.name}, Age: ${player1.age}, Pos: ${player1.position}, ADP: ${player1.adp}, Proj: ${player1.projectedPoints}, Rank: ${player1.positionRank}, Stats: ${player1.mainStats}, Injuries: ${player1.injuryStatus}\n` +
    `Player 2: ${player2.name}, Age: ${player2.age}, Pos: ${player2.position}, ADP: ${player2.adp}, Proj: ${player2.projectedPoints}, Rank: ${player2.positionRank}, Stats: ${player2.mainStats}, Injuries: ${player2.injuryStatus}`;

  try {
    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful fantasy basketball assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 180,
        temperature: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const summary = openaiRes.data.choices[0].message.content.trim();
    res.json({ summary });
  } catch (error) {
    console.error('OpenAI API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate AI summary.' });
  }
}

module.exports = { getAiSummary }; 