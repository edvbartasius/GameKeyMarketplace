const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const listRouter = require('./routes/list');
app.use('/api/list', listRouter);

// Return JSON instead of HTML for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested endpoint was not found.' });
});

// Error handling
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;