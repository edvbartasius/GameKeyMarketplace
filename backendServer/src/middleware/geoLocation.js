// Default country code for development and fallback
const DEFAULT_COUNTRY_CODE = 'LT'; // Lithuania

// Middleware to detect user's country from Cloudflare headers or IP address
const detectUserCountry = (req, res, next) => {
    try {
        // Priority 1: Use Cloudflare's CF-IPCountry header (most efficient)
        // This header is automatically added by Cloudflare when proxying traffic
        const cfCountry = req.headers['cf-ipcountry'];

        if (cfCountry && cfCountry !== 'XX') {
            // XX means unknown country in Cloudflare
            req.userCountryCode = cfCountry;
            return next();
        }

        // Priority 2: Check if we're in local development
        const ip = req.headers['x-forwarded-for']?.split(',')[0].trim()
                 || req.headers['x-real-ip']
                 || req.connection.remoteAddress
                 || req.socket.remoteAddress;

        // For localhost/private IPs, default to Lithuania
        if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            req.userCountryCode = DEFAULT_COUNTRY_CODE;
            return next();
        }

        // If not behind Cloudflare and not local, default to Lithuania
        req.userCountryCode = DEFAULT_COUNTRY_CODE;
        next();
    } catch (error) {
        // If anything fails, default to Lithuania
        console.error('Geo-location error:', error.message);
        req.userCountryCode = DEFAULT_COUNTRY_CODE;
        next();
    }
};

module.exports = { detectUserCountry };
