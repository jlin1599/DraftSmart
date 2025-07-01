import { useState, useEffect } from 'react';

function PlayerSearch() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    
    useEffect(() =>{
        setLoading(true);
        fetch("http://localhost:5000/api/active-players")
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

    const filteredPlayers = players.filter(player =>
        player.longName.toLowerCase().includes(search.toLowerCase()) //convert to lowercase to make the search case-insensitive
    );

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">NBA Player Search</h1>
            <input
                type="text"
                placeholder="Search players by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-6 px-4 py-2 border border-gray-300 rounded w-full"
            />
            {loading && <p className="text-center">Loading players...</p>}
            {!loading && (
                <ul className="max-h-[60vh] overflow-y-auto space-y-2 bg-white/70 rounded shadow p-4">
                    {filteredPlayers.map(player => (
                        <li key={player.playerID} className="py-1 px-2 rounded hover:bg-blue-100 transition">
                            {player.longName} <span className="text-gray-500">({player.team})</span> - {player.pos}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default PlayerSearch;