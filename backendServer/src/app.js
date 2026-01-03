const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Helmet configuration for JSON API
app.use(helmet({
  contentSecurityPolicy: false, // Not needed for JSON APIs
  crossOriginEmbedderPolicy: false, // Can break API calls
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin API calls
  
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true
  },
  noSniff: true, // Prevent MIME sniffing
  xssFilter: true, // Enable XSS filter
  hidePoweredBy: true, // Hide X-Powered-By header
  frameguard: { action: 'deny' } // Prevent iframe embedding
}));


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