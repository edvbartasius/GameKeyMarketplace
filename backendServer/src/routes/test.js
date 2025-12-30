// routes/test.js
const express = require('express');
const router = express.Router();

// GET - Basic test route
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Test API is working',
        timestamp: new Date().toISOString(),
        method: 'GET'
    });
});

module.exports = router;