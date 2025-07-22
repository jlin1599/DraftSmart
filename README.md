# DraftSmart: NBA Fantasy Analysis Tool

DraftSmart is a full-stack NBA fantasy companion app that helps you compare players, track stats, and optimize your fantasy team with AI-powered insights.

## Features
- **Player Search:** Search and analyze any NBA player with detailed stats, fantasy points, and performance metrics. Save your favorite players to your watchlist before draft day.
- **Player Compare:** Side-by-side comparison of two players with projections, average draft position, injury status, and **AI-powered draft advice**.
- **Top Stats:** Discover the top 50 performers in points, rebounds, assists, steals, blocks, and 3-pointers.
- **Saved Players:** Save your favorite players for quick access during draft day.

---

## Project Structure

```
NBA_Fantasy/
  nba-fantasy-client/      # Frontend (React + Vite)
  nba-fantasy-server/      # Backend (Node.js + Express)
```

### Backend (`nba-fantasy-server/`)

- **server.js**: Main entry point. Sets up Express, middleware, and imports all routes.
- **routes/**: Defines API endpoints and delegates to controllers.
  - `players.js`: Player comparison endpoint.
  - `ai.js`: AI summary endpoint.
  - `general.js`: General endpoints (health check, active players).
- **controllers/**: Contains business logic for each route.
  - `playersController.js`: Handles player comparison logic.
  - `aiController.js`: Handles AI-powered summary logic (calls OpenAI API).
  - `generalController.js`: Handles health check and active players endpoints.
- **utils/playerUtils.js**: Shared utility functions for fetching/caching NBA data, calculating fantasy points, projections, and ADP. All caching logic is here to minimize external API calls.

### Frontend (`nba-fantasy-client/`)
- **src/components/**: React components for Player Search, Compare, Top Stats, Saved Players, etc.
- **.env**: Set `VITE_API_URL` to your backend URL (local or production).

---

## AI-Powered Player Comparison
- The backend `/api/ai/compare-summary` endpoint uses OpenAI to generate expert, concise, and actionable player comparison summaries.
- Prompt engineering ensures the AI provides insightful, draft-focused advice.
- Set your OpenAI API key in the backend `.env` or Render dashboard.

---

## Caching Strategy
- **Teams/Players:** 1 hour cache
- **Projections:** 15 minute cache
- **ADP:** 24 hour cache
- All caching is in-memory and handled in `utils/playerUtils.js` to reduce API calls and speed up responses.

---

## Setup Instructions

### 1. Clone the Repository
```
git clone <your-repo-url>
cd NBA_Fantasy
```

### 2. Backend Setup
```
cd nba-fantasy-server
npm install
# Create a .env file with your API keys:
# TANK01_API_KEY=your_tank01_key
# TANK01_API_HOST=your_tank01_host
# OPENAI_API_KEY=your_openai_key
npm run dev  # Uses nodemon for live reload
```

### 3. Frontend Setup
```
cd nba-fantasy-client
npm install
# Create a .env file:
# VITE_API_URL=http://localhost:5000
npm run dev
```

---

## Deployment
- Deploy the backend (nba-fantasy-server) to Render or your preferred Node.js host.
- Deploy the frontend (nba-fantasy-client) to Vercel or your preferred static host.
- Update environment variables as needed for production.

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[MIT](LICENSE)
