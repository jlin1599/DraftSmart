import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function SavedPlayers() {
  const [savedPlayerIDs, setSavedPlayerIDs] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState({});
  const navigate = useNavigate();

  // Fetch saved player IDs for the logged-in user
  useEffect(() => {
    const fetchSavedPlayers = async () => {
      setLoading(true);
      setError("");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("You must be logged in to view saved players.");
        setLoading(false);
        return;
      }
      const user_id = session.user.id;
      const { data, error } = await supabase
        .from("saved_players")
        .select("player_id")
        .eq("user_id", user_id);
      if (error) {
        setError("Could not fetch saved players.");
      } else {
        setSavedPlayerIDs(data.map(row => row.player_id));
      }
      setLoading(false);
    };
    fetchSavedPlayers();
  }, []);

  // Fetch all players from the API
  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_BASE_URL}/api/active-players`)
      .then(res => res.json())
      .then(data => {
        const allPlayers = data.body.flatMap(team => Object.values(team.Roster));
        setAllPlayers(allPlayers);
      })
      .catch(() => setError("Could not fetch player data."));
  }, []);

  // Remove player from saved list
  const removePlayer = async (playerID) => {
    setRemoving(prev => ({ ...prev, [playerID]: true }));
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("You must be logged in to remove players.");
      setRemoving(prev => ({ ...prev, [playerID]: false }));
      return;
    }
    const user_id = session.user.id;
    const { error } = await supabase
      .from("saved_players")
      .delete()
      .eq("user_id", user_id)
      .eq("player_id", playerID);
    if (error) {
      setError("Could not remove player. Try again.");
    } else {
      setSavedPlayerIDs(ids => ids.filter(id => id !== playerID));
    }
    setRemoving(prev => ({ ...prev, [playerID]: false }));
  };

  // Filter to only saved players
  const savedPlayers = allPlayers.filter(player => savedPlayerIDs.includes(player.playerID));

  return (
    <div className="max-w-2xl mx-auto p-8">
      <button
        onClick={() => navigate("/")}
        className="mt-6 ml-4 mb-6 px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-blue-500 shadow shadow-blue-500/30 text-white font-semibold flex items-center gap-2 transition hover:bg-blue-500/80 hover:text-white hover:shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Your Saved Players</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border-2 border-blue-500 min-h-[200px]">
        {loading ? (
          <div className="text-blue-300 text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-400 text-center">{error}</div>
        ) : savedPlayers.length === 0 ? (
          <div className="text-gray-300 text-center">You have no saved players yet.</div>
        ) : (
          <ul className="divide-y divide-blue-900">
            {savedPlayers.map(player => (
              <li key={player.playerID} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={player.espnHeadshot}
                    alt={player.longName}
                    className="w-10 h-10 rounded-full border border-blue-400 object-cover"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div>
                    <div className="text-lg font-bold text-blue-200">{player.longName}</div>
                    <div className="text-sm text-blue-400">{player.team} - {player.pos}</div>
                  </div>
                </div>
                <button
                  onClick={() => removePlayer(player.playerID)}
                  disabled={removing[player.playerID]}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition disabled:opacity-50"
                >
                  {removing[player.playerID] ? "Removing..." : "Remove"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SavedPlayers; 