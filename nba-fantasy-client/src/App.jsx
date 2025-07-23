import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Home from "./components/Home";
import PlayerSearch from "./components/PlayerSearch";
import PlayerCompare from "./components/PlayerCompare";
import TopStats from "./components/TopStats";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import SavedPlayers from "./components/SavedPlayers";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check Supabase session on app start
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email);
      } else {
        setIsAuthenticated(false);
        setUserEmail("");
      }
      setIsLoading(false);
    };
    getSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email);
      } else {
        setIsAuthenticated(false);
        setUserEmail("");
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    // No-op, handled by Supabase listener
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Supabase listener will update state
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* NBA background image */}
      <img
        src="/nba.png"
        alt="NBA Background"
        className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none select-none"
        style={{ zIndex: 0 }}
      />
      {/* NBA gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-black to-red-900 opacity-80 pointer-events-none -z-10"></div>
      {/* Extra black overlay for more darkness */}
      <div className="absolute inset-0 bg-black opacity-90 pointer-events-none -z-10"></div>

      {/* Main app content */}
      <div className="relative z-10">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/" 
            element={
              <Home userEmail={userEmail} onLogout={handleLogout} />
            }
          />
          <Route 
            path="/search" 
            element={<PlayerSearch />} 
          />
          <Route 
            path="/compare" 
            element={<PlayerCompare />} 
          />
          <Route 
            path="/top-stats" 
            element={<TopStats />} 
          />
          <Route 
            path="/saved" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SavedPlayers />
              </ProtectedRoute>
            } 
          />
        </Routes>
        {isAuthenticated && <Footer />}
      </div>
    </div>
  );
}

export default App;
