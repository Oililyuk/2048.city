/**
 * Authentication Middleware
 * Verifies Reddit access token
 */

const redditAPI = require('../services/reddit-api');

/**
 * Verify access token from request headers
 */
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access token is required'
    });
  }

  try {
    // Verify token by getting user info
    const userInfo = await redditAPI.getUserInfo(token);
    
    // Attach user info to request
    req.user = userInfo;
    req.accessToken = token;
    
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired access token'
    });
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const userInfo = await redditAPI.getUserInfo(token);
      req.user = userInfo;
      req.accessToken = token;
    } catch (error) {
      // Token is invalid, but we don't fail the request
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
}

/**
 * Rate limiting for score sharing
 * Limits to 3 shares per hour per user
 */
const shareRateLimits = new Map(); // username -> [timestamps]

function rateLimitSharing(req, res, next) {
  const username = req.user.username;
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  // Get user's share history
  if (!shareRateLimits.has(username)) {
    shareRateLimits.set(username, []);
  }

  const userShares = shareRateLimits.get(username);
  
  // Remove shares older than 1 hour
  const recentShares = userShares.filter(timestamp => now - timestamp < oneHour);
  shareRateLimits.set(username, recentShares);

  // Check if user has exceeded limit
  if (recentShares.length >= 3) {
    const oldestShare = Math.min(...recentShares);
    const timeUntilReset = Math.ceil((oneHour - (now - oldestShare)) / 60000); // minutes

    return res.status(429).json({
      error: 'Too Many Requests',
      message: `You can only share 3 scores per hour. Please try again in ${timeUntilReset} minutes.`
    });
  }

  // Add current share timestamp
  recentShares.push(now);
  shareRateLimits.set(username, recentShares);

  next();
}

// Cleanup old rate limit data every hour
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  for (const [username, timestamps] of shareRateLimits.entries()) {
    const recent = timestamps.filter(t => now - t < oneHour);
    if (recent.length === 0) {
      shareRateLimits.delete(username);
    } else {
      shareRateLimits.set(username, recent);
    }
  }
}, 60 * 60 * 1000);

module.exports = {
  authenticateToken,
  optionalAuth,
  rateLimitSharing
};
