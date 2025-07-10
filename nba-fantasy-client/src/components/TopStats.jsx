import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Fantasy score calculation function (same as PlayerSearch)
function calculateFantasyScore(stats = {}) {
    const pts = Number(stats.pts) || 0;
    const fga = Number(stats.fga) || 0;
    const fgm = Number(stats.fgm) || 0;
    const tptfgm = Number(stats.tptfgm) || 0;
    const fta = Number(stats.fta) || 0;
    const ftm = Number(stats.ftm) || 0;
    const reb = Number(stats.reb) || 0;
    const ast = Number(stats.ast) || 0;
    const stl = Number(stats.stl) || 0;
    const blk = Number(stats.blk) || 0;
    const tov = Number(stats.TOV) || 0;
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

function TopStats() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('fantasy');
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const navigate = useNavigate();

    const categories = [
        { key: 'fantasy', label: 'Fantasy Points', icon: '⭐' },
        { key: 'pts', label: 'Points', icon: '🏀' },
        { key: 'reb', label: 'Rebounds', icon: '📊' },
        { key: 'ast', label: 'Assists', icon: '🎯' },
        { key: 'stl', label: 'Steals', icon: '⚡' },
        { key: 'blk', label: 'Blocks', icon: '🛡️' },
        { key: 'tptfgm', label: '3-Pointers', icon: '🎯' }
    ];

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

    // Add fantasyScore to each player
    const playersWithFantasy = players.map(player => ({
        ...player,
        fantasyScore: calculateFantasyScore(player.stats)
    }));

    // Get top players for selected category
    const getTopPlayers = (category, count = 50) => {
        if (!playersWithFantasy.length) return [];

        let sortedPlayers = [...playersWithFantasy];

        if (category === 'fantasy') {
            sortedPlayers.sort((a, b) => b.fantasyScore - a.fantasyScore);
        } else {
            sortedPlayers.sort((a, b) => {
                const aValue = Number(a.stats?.[category]) || 0;
                const bValue = Number(b.stats?.[category]) || 0;
                return bValue - aValue;
            });
        }

        return sortedPlayers.slice(0, count);
    };

    const topPlayers = getTopPlayers(selectedCategory);

    // Track category changes
    useEffect(() => {
        if (window.gtag) {
            window.gtag('event', 'view_stats_category', {
                'category': selectedCategory,
                'category_label': categories.find(cat => cat.key === selectedCategory)?.label
            });
        }
    }, [selectedCategory]);

    const getCategoryValue = (player, category) => {
        if (category === 'fantasy') {
            return player.fantasyScore.toFixed(1);
        }
        return player.stats?.[category] || '0';
    };

    const getCategorySuffix = (category) => {
        switch (category) {
            case 'pts':
            case 'reb':
            case 'ast':
            case 'stl':
            case 'blk':
                return '';
            case 'tptfgm':
                return ' 3PM';
            case 'fantasy':
                return ' FP';
            default:
                return '';
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
            
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-4xl font-extrabold mb-6 text-center tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-blue-500 drop-shadow-lg">
                    📈 Top Stats Leaders
                </h1>

                {/* Category Selector */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category.key}
                            onClick={() => setSelectedCategory(category.key)}
                            className={`p-4 rounded-xl text-center font-bold transition-all duration-300 ${
                                selectedCategory === category.key
                                    ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] border-2 border-blue-400"
                                    : "bg-black/40 text-white border-2 border-gray-600 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                            }`}
                        >
                            <div className="text-2xl mb-2">{category.icon}</div>
                            <div className="text-sm">{category.label}</div>
                        </button>
                    ))}
                </div>

                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-flex flex-col items-center gap-3 bg-black/40 backdrop-blur-md rounded-xl px-8 py-6 border border-blue-500 shadow-lg">
                            <div className="animate-bounce text-2xl">🏀</div>
                            <p className="text-lg font-semibold text-blue-300">Loading NBA players...</p>
                        </div>
                    </div>
                )}

                {!loading && (
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border-2 border-blue-500">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">
                            {categories.find(cat => cat.key === selectedCategory)?.label} Leaders
                        </h2>
                        
                        <div className="space-y-4">
                            {topPlayers.map((player, index) => (
                                <div
                                    key={player.playerID}
                                    className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                                        index === 0
                                            ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-400"
                                            : index === 1
                                            ? "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-2 border-gray-300"
                                            : index === 2
                                            ? "bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-2 border-orange-500"
                                            : "bg-white/5 border-2 border-gray-600"
                                    }`}
                                    onClick={() => {
                                        setSelectedPlayer(player);
                                        // Track player view from stats
                                        if (window.gtag) {
                                            window.gtag('event', 'view_player_from_stats', {
                                                'player_name': player.longName,
                                                'player_team': player.team,
                                                'player_position': player.pos,
                                                'stats_category': selectedCategory,
                                                'player_rank': index + 1
                                            });
                                        }
                                    }}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                            index === 0 ? "bg-yellow-500 text-black" :
                                            index === 1 ? "bg-gray-400 text-black" :
                                            index === 2 ? "bg-orange-600 text-white" :
                                            "bg-gray-600 text-white"
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={player.espnHeadshot}
                                                alt={player.longName}
                                                className="w-10 h-10 rounded-full border border-blue-400 object-cover"
                                                onError={e => { e.target.style.display = 'none'; }}
                                            />
                                            <div>
                                                <div className="text-white font-bold text-lg">{player.longName}</div>
                                                <div className="text-gray-300 text-sm">{player.team} • {player.pos}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-bold text-xl">
                                            {getCategoryValue(player, selectedCategory)}{getCategorySuffix(selectedCategory)}
                                        </div>
                                        <div className="text-gray-400 text-sm">per game</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for player details */}
            {selectedPlayer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-blue-500 shadow-lg shadow-blue-500/30 p-8 min-w-[320px] relative text-white">
                        <button 
                            className="absolute top-3 right-3 text-blue-300 hover:text-white text-2xl font-bold transition"
                            onClick={() => setSelectedPlayer(null)}
                        >
                            &times;
                        </button>
                        <div className="flex flex-col items-center mb-4">
                            <img
                                src={selectedPlayer.espnHeadshot}
                                alt={selectedPlayer.longName}
                                className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover mb-2"
                                onError={e => { e.target.style.display = 'none'; }}
                            />
                            <h2 className="text-2xl font-bold text-blue-300">{selectedPlayer.longName}</h2>
                        </div>
                        <p className="mb-2">Team: <span className="font-semibold text-blue-200">{selectedPlayer.team}</span></p>
                        <p className="mb-4">Position: <span className="font-semibold text-blue-200">{selectedPlayer.pos}</span></p>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            <p>PPG: <span className="font-semibold">{selectedPlayer.stats.pts}</span></p>
                            <p>RPG: <span className="font-semibold">{selectedPlayer.stats.reb}</span></p>
                            <p>APG: <span className="font-semibold">{selectedPlayer.stats.ast}</span></p>
                            <p>SPG: <span className="font-semibold">{selectedPlayer.stats.stl}</span></p>
                            <p>BPG: <span className="font-semibold">{selectedPlayer.stats.blk}</span></p>
                            <p>TOV: <span className="font-semibold">{selectedPlayer.stats.TOV}</span></p>
                            <p>3PM: <span className="font-semibold">{selectedPlayer.stats.tptfgm}</span></p>
                            <p>Fantasy Points: <span className="font-semibold text-blue-400">{selectedPlayer.fantasyScore.toFixed(1)}</span></p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TopStats; 