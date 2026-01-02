// routes/list.js

const express = require('express');
const router = express.Router();

const gameController = require('../controllers/GameController');
const { validateSearchQuery } = require('../middleware/validators');
const { detectUserCountry } = require('../middleware/geoLocation');

// GET /api/list or /api/list?search=<gamename>
router.get('/', detectUserCountry, validateSearchQuery, (req, res, next) => {
    if (req.query.search) {
        // Call search function if search parameter exists
        gameController.searchGames(req, res, next);
    } else {
        // Call getAllGames if no search parameter
        gameController.getAllGames(req, res, next);
    }
});

module.exports = router;