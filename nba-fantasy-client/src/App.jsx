import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PlayerSearch from "./components/PlayerSearch";
import PlayerCompare from "./components/PlayerCompare";
import TopStats from "./components/TopStats";
import Footer from "./components/Footer";

function App() {
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
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
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<PlayerSearch />} />
          <Route path="/compare" element={<PlayerCompare />} />
          <Route path="/top-stats" element={<TopStats />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
