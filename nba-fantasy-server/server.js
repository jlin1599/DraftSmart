require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Use modular routes
app.use('/api/players', require('./routes/players'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api', require('./routes/general'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 