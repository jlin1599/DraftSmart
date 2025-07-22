const express = require('express');
const router = express.Router();
const { test, activePlayers } = require('../controllers/generalController');

router.get('/test', test);
router.get('/active-players', activePlayers);

module.exports = router; 