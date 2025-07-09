function Footer() {
  return (
    <footer className="bg-black/40 backdrop-blur-sm border-t border-blue-500/30 mt-8">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="text-center text-gray-300 text-sm">
          <p className="mb-2">
            <span className="text-blue-400 font-semibold">DraftSmart</span> - NBA Fantasy Analysis Tool
          </p>
          <p className="mb-2 text-xs">
            For educational purposes only. Not affiliated with the NBA or any professional sports organization.
          </p>
          <p className="text-xs text-gray-400">
            Data provided by{' '}
            <a 
              href="https://www.tank01.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Tank01 API
            </a>
            {' '}• Player images from ESPN
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This tool is for fantasy sports analysis and educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 