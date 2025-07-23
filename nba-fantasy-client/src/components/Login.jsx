import { useState } from "react";
import { supabase } from "../supabaseClient";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) setError(error.message);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-5xl font-extrabold text-white tracking-wide mb-4"
            style={{ textShadow: "0 2px 8px #000, 0 0px 32px #1e3a8a" }}
          >
            DraftSmart
          </h1>
          <p className="text-lg text-blue-300 font-semibold tracking-wide">
            NBA Fantasy Analysis Tool
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border-2 border-blue-500 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Save Your Picks</h2>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 px-4 rounded-lg shadow hover:bg-gray-100 transition-all duration-200 mb-2 border border-gray-300"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-6 w-6" />
            {isLoading ? "Logging in..." : "Log in to Keep Track"}
          </button>
          <div className="text-xs text-gray-300 text-center mt-2 mb-1">
            We ask for login only so you can save your favorite players and track them later. No emails, no spam.
          </div>
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mt-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            For educational purposes only. Not affiliated with the NBA. 
            Data provided by Tank01 API. Player images from ESPN.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login; 