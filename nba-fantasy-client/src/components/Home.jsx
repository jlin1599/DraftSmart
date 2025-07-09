import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1
          className="text-5xl md:text-6xl font-extrabold text-white tracking-wide mb-4"
          style={{ textShadow: "0 2px 8px #000, 0 0px 32px #1e3a8a" }}
        >
          DraftSmart
        </h1>
        <p className="text-xl md:text-2xl text-blue-300 font-semibold tracking-wide">
          NBA Fantasy Analysis Tool
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
      </div>
      
      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/search" className="w-full">
          <div className="relative rounded-xl p-6 text-center text-xl font-bold shadow-lg bg-black/40 backdrop-blur-sm text-white border-2 border-blue-500 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 cursor-pointer">
            Player Search
          </div>
        </Link>
        <Link to="/compare" className="w-full">
          <div className="relative rounded-xl p-6 text-center text-xl font-bold shadow-lg bg-black/40 backdrop-blur-sm text-white border-2 border-blue-500 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 cursor-pointer">
            Player Compare
          </div>
        </Link>
        <Link to="/top-stats" className="w-full">
          <div className="relative rounded-xl p-6 text-center text-xl font-bold shadow-lg bg-black/40 backdrop-blur-sm text-white border-2 border-blue-500 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 cursor-pointer">
            Top Stats
          </div>
        </Link>
        <div className="w-full">
          <div className="relative rounded-xl p-6 text-center text-xl font-bold shadow-lg bg-black/40 backdrop-blur-sm text-gray-400 border-2 border-gray-600 cursor-not-allowed">
            Saved Players (In Progress)
          </div>
        </div>
      </div>
      
      {/* App Overview */}
      <div className="mt-8 bg-black/40 backdrop-blur-sm rounded-xl p-6 border-2 border-blue-500">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">How DraftSmart Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div className="text-center">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-bold text-blue-300 mb-2">Player Search</h3>
            <p className="text-sm text-gray-300">
              Search and analyze any NBA player with detailed stats, fantasy points, and performance metrics.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚖️</div>
            <h3 className="font-bold text-blue-300 mb-2">Player Compare</h3>
            <p className="text-sm text-gray-300">
              Side-by-side comparison of two players with projections, average draft position, and injury status.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📈</div>
            <h3 className="font-bold text-blue-300 mb-2">Top Stats</h3>
            <p className="text-sm text-gray-300">
              Discover the top 50 performers in points, rebounds, assists, steals, blocks, and 3-pointers.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          For educational purposes only. Not affiliated with the NBA. 
          Data provided by Tank01 API. Player images from ESPN.
        </p>
      </div>
    </div>
  );
}

export default Home;