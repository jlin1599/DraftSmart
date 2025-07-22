const express = require('express');
const router = express.Router();
const { getAiSummary } = require('../controllers/aiController');

router.post('/compare-summary', getAiSummary);

module.exports = router; 