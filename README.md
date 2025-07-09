# DraftSmart – NBA Fantasy Analysis Tool

A modern web app for fantasy basketball players to search, compare, and analyze NBA players with real-time stats, leaderboards, and fantasy scoring.

## 🚀 Live Demo

[https://nba-draftsmart.vercel.app](https://nba-draftsmart.vercel.app)

---

## Features

- **Player Search:** Instantly find and analyze any NBA player with up-to-date stats and fantasy points.
- **Player Compare:** Side-by-side comparison of two players, including projections and advanced stats.
- **Top Stats:** View the top 50 players in key categories (points, rebounds, assists, steals, blocks, 3-pointers, fantasy points).
- **Responsive Design:** Works beautifully on desktop and mobile.
- **Google Analytics:** Tracks user engagement and feature usage.
- **SEO Ready:** Includes sitemap.xml and Google site verification for search indexing.
- **Educational Disclaimers:** Not affiliated with the NBA; data attribution included.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Express.js (Node.js)
- **APIs:** [Tank01 NBA API](https://www.tank01.com/)
- **Deployment:** Vercel
- **Analytics:** Google Analytics

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/jlin1599/DraftSmart.git
cd DraftSmart/nba-fantasy-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Deploy

- Push to GitHub and connect to [Vercel](https://vercel.com/) for instant deployment.

---

## Project Structure

```
nba-fantasy-client/
  public/
    sitemap.xml
    google-site-verification.html
  src/
    components/
      Home.jsx
      PlayerSearch.jsx
      PlayerCompare.jsx
      TopStats.jsx
      Footer.jsx
    App.jsx
    main.jsx
  vercel.json
  package.json
```

---


## Disclaimers & Credits

- **For educational purposes only.**
- **Not affiliated with the NBA or any professional sports organization.**
- **Data provided by [Tank01 API](https://www.tank01.com/).**
- **Player images from ESPN.**

---

## License

MIT
