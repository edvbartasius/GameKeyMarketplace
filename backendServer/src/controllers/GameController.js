const Game = require('../../models/game');

// Get all games
exports.getAllGames = async (req, res, next) => {
    try {
        const userCountryCode = req.userCountryCode || null;
        const games = await Game.getAll(userCountryCode);

        res.json({
            success: true,
            count: games.length,
            data: games
        });
    } catch (error) {
        next(error);
    }
};

// Search games by search parameter
exports.searchGames = async (req, res, next) => {
    try {
        const { search } = req.query;
        const userCountryCode = req.userCountryCode || null;
        const results = await Game.search(search, 100, userCountryCode);

        res.json({
            success: true,
            count: results.length,
            searchTerm: search,
            data: results
        });
    } catch (error) {
        next(error);
    }
};