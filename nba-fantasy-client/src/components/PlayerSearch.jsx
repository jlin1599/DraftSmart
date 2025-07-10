import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Fantasy score calculation function
function calculateFantasyScore(stats = {}) {
    // Default all stats to 0 if missing
    const pts = Number(stats.pts) || 0;
    const fga = Number(stats.fga) || 0;
    const fgm = Number(stats.fgm) || 0;
    const tptfgm = Number(stats.tptfgm) || 0; // 3PM
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

function PlayerSearch() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [sortByFantasy, setSortByFantasy] = useState(false);
    const navigate = useNavigate();
    
    // Get API URL from environment variable or default to localhost
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    useEffect(() =>{
        setLoading(true);
        fetch(`${API_BASE_URL}/api/active-players`)
        .then(res => res.json())
        .then(data=>{
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

    // Filter by search
    let filteredPlayers = playersWithFantasy.filter(player =>
        player.longName.toLowerCase().includes(search.toLowerCase())
    );

    // Track search when user types
    useEffect(() => {
        if (search && window.gtag) {
            window.gtag('event', 'search_player', {
                'search_term': search,
                'results_count': filteredPlayers.length
            });
        }
    }, [search]);

    // Sort by fantasyScore if toggled
    if (sortByFantasy) {
        filteredPlayers = filteredPlayers.sort((a, b) => b.fantasyScore - a.fantasyScore);
    }

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
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-4xl font-extrabold mb-6 text-center tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-blue-500 drop-shadow-lg">
                    NBA Player Search
                </h1>
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search players by name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-4 pr-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-blue-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none shadow-lg transition placeholder-gray-300 text-white"
                    />
                </div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-300 font-semibold">Fantasy Score (Season Avg)</span>
                    <button
                        className={`px-3 py-1 rounded bg-blue-500 text-white font-semibold text-sm shadow hover:bg-blue-600 transition ml-2 ${sortByFantasy ? 'ring-2 ring-blue-300' : ''}`}
                        onClick={() => setSortByFantasy(s => !s)}
                    >
                        {sortByFantasy ? 'Sorted by Fantasy Score' : 'Sort by Fantasy Score'}
                    </button>
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
                    <ul className="max-h-[60vh] overflow-y-auto rounded shadow p-4">
                        {filteredPlayers.map(player => (
                            <li 
                            key={player.playerID}
                            className="mb-3 px-4 py-3 rounded-xl bg-black/60 backdrop-blur-md border border-blue-500 hover:border-blue-400 shadow-lg shadow-blue-500/30 transition cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between text-white hover:bg-blue-900/60"
                            onClick={() => {
                                setSelectedPlayer(player);
                                // Track player view
                                if (window.gtag) {
                                    window.gtag('event', 'view_player_details', {
                                        'player_name': player.longName,
                                        'player_team': player.team,
                                        'player_position': player.pos
                                    });
                                }
                            }}
                            >
                            <span className="flex items-center gap-3">
                                <img
                                    src={player.espnHeadshot}
                                    alt={player.longName}
                                    className="w-8 h-8 rounded-full border border-blue-400 object-cover"
                                    onError={e => { e.target.style.display = 'none'; }}
                                />
                                <span>
                                    {player.longName} <span className="text-blue-400">({player.team})</span> - <span className="text-blue-300">{player.pos}</span>
                                </span>
                            </span>
                            <span className="text-sm text-blue-200 mt-1 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-2">
                                <span>
                                    PPG: <span className="font-semibold">{player.stats?.pts ?? '-'}</span>,
                                    RPG: <span className="font-semibold">{player.stats?.reb ?? '-'}</span>,
                                    APG: <span className="font-semibold">{player.stats?.ast ?? '-'}</span>
                                </span>
                                <span className="font-bold text-blue-400">FS: {player.fantasyScore.toFixed(1)}</span>
                            </span>
                            </li>
                        ))}
                    </ul>
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
                            <p>FGM: <span className="font-semibold">{selectedPlayer.stats.fgm}</span></p>
                            <p>FGA: <span className="font-semibold">{selectedPlayer.stats.fga}</span></p>
                            <p>FG%: <span className="font-semibold">{selectedPlayer.stats.fgp}</span></p>
                            <p>3PM: <span className="font-semibold">{selectedPlayer.stats.tptfgm}</span></p>
                            <p>3PA: <span className="font-semibold">{selectedPlayer.stats.tptfga}</span></p>
                            <p>3P%: <span className="font-semibold">{selectedPlayer.stats.tptfgp}</span></p>
                            <p>FTM: <span className="font-semibold">{selectedPlayer.stats.ftm}</span></p>
                            <p>FTA: <span className="font-semibold">{selectedPlayer.stats.fta}</span></p>
                            <p>FT%: <span className="font-semibold">{selectedPlayer.stats.ftp}</span></p>
                            <p>MPG: <span className="font-semibold">{selectedPlayer.stats.mins}</span></p>
                            <p>Games Played: <span className="font-semibold">{selectedPlayer.stats.gamesPlayed}</span></p>
                            <p>True Shooting %: <span className="font-semibold">{selectedPlayer.stats.trueShootingPercentage}</span></p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PlayerSearch;