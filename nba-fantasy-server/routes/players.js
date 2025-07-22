const express = require('express');
const router = express.Router();
const { comparePlayers } = require('../controllers/playersController');

router.get('/compare', comparePlayers);

module.exports = router; 