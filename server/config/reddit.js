/**
 * Reddit API Configuration
 */

module.exports = {
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  redirectUri: process.env.REDDIT_REDIRECT_URI,
  userAgent: process.env.REDDIT_USER_AGENT || '2048.city/1.0',
  targetSubreddit: process.env.TARGET_SUBREDDIT || '2048city',
  
  // OAuth endpoints
  authorizationUrl: 'https://www.reddit.com/api/v1/authorize',
  tokenUrl: 'https://www.reddit.com/api/v1/access_token',
  apiBaseUrl: 'https://oauth.reddit.com',
  
  // Required scopes
  scopes: ['identity', 'submit'],
  
  // Rate limiting
  maxSharesPerHour: 3,
  
  // Validate configuration
  isConfigured() {
    return !!(this.clientId && this.clientSecret && this.redirectUri);
  },
  
  // Get validation errors
  getConfigErrors() {
    const errors = [];
    if (!this.clientId) errors.push('REDDIT_CLIENT_ID is not set');
    if (!this.clientSecret) errors.push('REDDIT_CLIENT_SECRET is not set');
    if (!this.redirectUri) errors.push('REDDIT_REDIRECT_URI is not set');
    return errors;
  }
};
