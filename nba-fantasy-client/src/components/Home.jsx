import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-xl mx-auto p-8 flex flex-col gap-8 items-center">
      <h1
        className="text-4xl font-extrabold text-center mb-8 text-white tracking-wide"
        style={{ textShadow: "0 2px 8px #000, 0 0px 32px #1e3a8a" }}
      >
        🏀 DraftSmart
      </h1>
      <Link to="/search" className="w-full">
        <div className="relative rounded-xl p-6 text-center text-xl font-bold shadow-lg bg-black/40 backdrop-blur-sm text-white border-2 border-blue-500 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 cursor-pointer">
          Player Search
        </div>
      </Link>
      {/* Add Compare and Draft Board links later */}
    </div>
  );
}

export default Home;