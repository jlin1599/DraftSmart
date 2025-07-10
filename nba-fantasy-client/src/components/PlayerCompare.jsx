import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper function to calculate age from birth date
function calculateAge(birthDate) {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function PlayerCompare() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlayer1, setSelectedPlayer1] = useState(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [filteredPlayers1, setFilteredPlayers1] = useState([]);
  const [filteredPlayers2, setFilteredPlayers2] = useState([]);
  const navigate = useNavigate();

  // Get API URL from environment variable or default to localhost
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/active-players`)
      .then(res => res.json())
      .then(data => {
        const allPlayers = data.body.flatMap(team =>
          Object.values(team.Roster)
        );
        setPlayers(allPlayers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCompare = async () => {
    if (!selectedPlayer1 || !selectedPlayer2) return;
    
    setComparing(true);
    
    // Track comparison event
    if (window.gtag) {
      window.gtag('event', 'compare_players', {
        'player1_name': selectedPlayer1.longName,
        'player2_name': selectedPlayer2.longName,
        'player1_team': selectedPlayer1.team,
        'player2_team': selectedPlayer2.team
      });
    }
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/players/compare?ids=${selectedPlayer1.playerID},${selectedPlayer2.playerID}`
      );
      const data = await response.json();
      setComparisonData(data);
    } catch (error) {
      console.error('Error comparing players:', error);
    } finally {
      setComparing(false);
    }
  };

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 ml-4 mb-6 px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-blue-500 shadow shadow-blue-500/30 text-white font-semibold flex items-center gap-2 transition hover:bg-blue-500/80 hover:text-white hover:shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-6 text-center tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-blue-500 drop-shadow-lg">
          Player Compare
        </h1>

        {/* Player Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Player 1 Selection */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-blue-500 p-6">
            <h2 className="text-xl font-bold text-blue-300 mb-4">Player 1</h2>
            <input
              type="text"
              placeholder="Search for player 1..."
              value={search1}
              onChange={(e) => {
                setSearch1(e.target.value);
                const filtered = players.filter(player =>
                  player.longName.toLowerCase().includes(e.target.value.toLowerCase())
                );
                setFilteredPlayers1(filtered.slice(0, 5));
              }}
              className="w-full p-3 rounded-lg bg-black/60 border border-blue-500 text-white placeholder-gray-300 mb-4"
            />
            {search1 && filteredPlayers1.length > 0 && (
              <div className="absolute z-10 w-full bg-black/90 border border-blue-500 rounded-lg max-h-60 overflow-y-auto">
                {filteredPlayers1.map(player => (
                  <div
                    key={player.playerID}
                    onClick={() => {
                      setSelectedPlayer1(player);
                      setSearch1("");
                      setFilteredPlayers1([]);
                    }}
                    className="p-3 hover:bg-blue-900/50 cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={player.espnHeadshot}
                      alt={player.longName}
                      className="w-8 h-8 rounded-full border border-blue-400 object-cover"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <span className="text-white">{player.longName} ({player.team})</span>
                  </div>
                ))}
              </div>
            )}
            {selectedPlayer1 && (
              <div className="flex items-center gap-3 p-3 bg-blue-900/30 rounded-lg relative">
                <img
                  src={selectedPlayer1.espnHeadshot}
                  alt={selectedPlayer1.longName}
                  className="w-12 h-12 rounded-full border border-blue-400 object-cover"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <div>
                  <div className="font-semibold text-white">{selectedPlayer1.longName}</div>
                  <div className="text-blue-300">
                    {selectedPlayer1.team} - {selectedPlayer1.pos}
                    {selectedPlayer1.bDay && (
                      <span className="text-gray-400 ml-2">({calculateAge(selectedPlayer1.bDay)} years old)</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlayer1(null)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white text-lg font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Player 2 Selection */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-blue-500 p-6">
            <h2 className="text-xl font-bold text-blue-300 mb-4">Player 2</h2>
            <input
              type="text"
              placeholder="Search for player 2..."
              value={search2}
              onChange={(e) => {
                setSearch2(e.target.value);
                const filtered = players.filter(player =>
                  player.longName.toLowerCase().includes(e.target.value.toLowerCase())
                );
                setFilteredPlayers2(filtered.slice(0, 5));
              }}
              className="w-full p-3 rounded-lg bg-black/60 border border-blue-500 text-white placeholder-gray-300 mb-4"
            />
            {search2 && filteredPlayers2.length > 0 && (
              <div className="absolute z-10 w-full bg-black/90 border border-blue-500 rounded-lg max-h-60 overflow-y-auto">
                {filteredPlayers2.map(player => (
                  <div
                    key={player.playerID}
                    onClick={() => {
                      setSelectedPlayer2(player);
                      setSearch2("");
                      setFilteredPlayers2([]);
                    }}
                    className="p-3 hover:bg-blue-900/50 cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={player.espnHeadshot}
                      alt={player.longName}
                      className="w-8 h-8 rounded-full border border-blue-400 object-cover"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <span className="text-white">{player.longName} ({player.team})</span>
                  </div>
                ))}
              </div>
            )}
            {selectedPlayer2 && (
              <div className="flex items-center gap-3 p-3 bg-blue-900/30 rounded-lg relative">
                <img
                  src={selectedPlayer2.espnHeadshot}
                  alt={selectedPlayer2.longName}
                  className="w-12 h-12 rounded-full border border-blue-400 object-cover"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <div>
                  <div className="font-semibold text-white">{selectedPlayer2.longName}</div>
                  <div className="text-blue-300">
                    {selectedPlayer2.team} - {selectedPlayer2.pos}
                    {selectedPlayer2.bDay && (
                      <span className="text-gray-400 ml-2">({calculateAge(selectedPlayer2.bDay)} years old)</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlayer2(null)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white text-lg font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Compare Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCompare}
            disabled={!selectedPlayer1 || !selectedPlayer2 || comparing}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
          >
            {comparing ? 'Comparing...' : 'Compare Players'}
          </button>
        </div>

        {/* Comparison Results */}
        {comparisonData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisonData.map((player) => (
              <div key={player.id} className="bg-black/40 backdrop-blur-md rounded-xl border border-blue-500 p-6">
                <div className="text-center mb-6">
                  <img
                    src={player.playerInfo.espnHeadshot}
                    alt={player.playerInfo.longName}
                    className="w-24 h-24 rounded-full border-4 border-blue-400 mx-auto mb-3 object-cover"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <h3 className="text-2xl font-bold text-white">{player.playerInfo.longName}</h3>
                  <p className="text-blue-300">
                    {player.playerInfo.team} - {player.playerInfo.pos}
                    {player.playerInfo.bDay && (
                      <span className="text-gray-400 ml-2">({calculateAge(player.playerInfo.bDay)} years old)</span>
                    )}
                  </p>
                </div>

                {/* Stats Comparison */}
                {player.mainStats && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-blue-300 mb-3">Season Averages</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">PPG:</span>
                        <span className="font-semibold text-white">{player.mainStats.pts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">RPG:</span>
                        <span className="font-semibold text-white">{player.mainStats.reb}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">APG:</span>
                        <span className="font-semibold text-white">{player.mainStats.ast}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">SPG:</span>
                        <span className="font-semibold text-white">{player.mainStats.stl}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">BPG:</span>
                        <span className="font-semibold text-white">{player.mainStats.blk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">TOV:</span>
                        <span className="font-semibold text-white">{player.mainStats.TOV}</span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span className="text-gray-300">Fantasy Points:</span>
                        <span className="font-semibold text-green-400">{player.mainStats.fantasyPoints.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ADP Data */}
                {player.adp && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-blue-300 mb-3">Draft Position</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Overall ADP:</span>
                        <span className="font-semibold text-white">{player.adp.overallADP}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Position ADP:</span>
                        <span className="font-semibold text-white">{player.adp.posADP}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Injury Status */}
                {player.injuries && player.injuries.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-red-300 mb-3">Injury Status</h4>
                    {player.injuries.map((injury, idx) => (
                      <div key={idx} className="bg-red-900/30 rounded-lg p-3 text-sm">
                        <div className="font-semibold text-red-300">{injury.designation}</div>
                        <div className="text-gray-300 mt-1">{injury.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex flex-col items-center gap-3 bg-black/40 backdrop-blur-md rounded-xl px-8 py-6 border border-blue-500 shadow-lg">
              <div className="animate-bounce text-2xl">🏀</div>
              <p className="text-lg font-semibold text-blue-300">Loading players...</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PlayerCompare;
