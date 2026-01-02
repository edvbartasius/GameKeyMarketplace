const { query, validationResult } = require('express-validator');

// Validation middleware for search query
exports.validateSearchQuery = [
    query('search')
        .optional()
        .isString()
        .withMessage('Search parameter must be a string')
        .trim()
        .isLength({ min: 0, max: 100 })
        .withMessage('Search parameter must be between 0 and 100 characters')
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];
