/**
 * Reddit API Service
 * Handles all interactions with Reddit API
 */

const axios = require('axios');
const redditConfig = require('../config/reddit');

class RedditAPIService {
  constructor() {
    this.config = redditConfig;
  }

  /**
   * Generate Reddit authorization URL
   * @param {string} state - Random state string for CSRF protection
   * @returns {string} Authorization URL
   */
  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      state: state,
      redirect_uri: this.config.redirectUri,
      duration: 'permanent',
      scope: this.config.scopes.join(' ')
    });

    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   * @param {string} code - Authorization code from Reddit
   * @returns {Promise<object>} Token response
   */
  async exchangeCodeForToken(code) {
    try {
      const auth = Buffer.from(
        `${this.config.clientId}:${this.config.clientSecret}`
      ).toString('base64');

      const response = await axios.post(
        this.config.tokenUrl,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.config.redirectUri
        }),
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': this.config.userAgent
          }
        }
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        scope: response.data.scope
      };
    } catch (error) {
      console.error('Token exchange error:', error.response?.data || error.message);
      throw new Error('Failed to exchange code for token');
    }
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<object>} New token data
   */
  async refreshAccessToken(refreshToken) {
    try {
      const auth = Buffer.from(
        `${this.config.clientId}:${this.config.clientSecret}`
      ).toString('base64');

      const response = await axios.post(
        this.config.tokenUrl,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }),
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': this.config.userAgent
          }
        }
      );

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        scope: response.data.scope
      };
    } catch (error) {
      console.error('Token refresh error:', error.response?.data || error.message);
      throw new Error('Failed to refresh token');
    }
  }

  /**
   * Get user information from Reddit
   * @param {string} accessToken - User's access token
   * @returns {Promise<object>} User data
   */
  async getUserInfo(accessToken) {
    try {
      const response = await axios.get(
        `${this.config.apiBaseUrl}/api/v1/me`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': this.config.userAgent
          }
        }
      );

      return {
        username: response.data.name,
        id: response.data.id,
        karma: response.data.link_karma + response.data.comment_karma,
        created: new Date(response.data.created_utc * 1000).toISOString(),
        iconUrl: response.data.icon_img
      };
    } catch (error) {
      console.error('Get user info error:', error.response?.data || error.message);
      throw new Error('Failed to get user information');
    }
  }

  /**
   * Submit a post to Reddit
   * @param {string} accessToken - User's access token
   * @param {object} postData - Post data (title, text)
   * @returns {Promise<object>} Post response
   */
  async submitPost(accessToken, postData) {
    try {
      const response = await axios.post(
        `${this.config.apiBaseUrl}/api/submit`,
        {
          sr: this.config.targetSubreddit,
          kind: 'self',
          title: postData.title,
          text: postData.text,
          resubmit: false,
          sendreplies: true
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': this.config.userAgent
          }
        }
      );

      if (response.data.success) {
        const postUrl = response.data.data?.url || response.data.json?.data?.url;
        const postId = postUrl ? postUrl.split('/comments/')[1]?.split('/')[0] : null;
        
        return {
          success: true,
          postId: postId,
          postUrl: postUrl
        };
      } else {
        throw new Error('Reddit API returned success: false');
      }
    } catch (error) {
      console.error('Submit post error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to submit post to Reddit');
    }
  }

  /**
   * Validate score data to prevent cheating
   * @param {object} scoreData - Score data to validate
   * @returns {boolean} Is valid
   */
  validateScore(scoreData) {
    const { score, bestTile, moves } = scoreData;

    // Basic validation
    if (score < 0 || bestTile < 2 || moves < 0) {
      return false;
    }

    // Check if bestTile is a power of 2
    if (bestTile & (bestTile - 1) !== 0) {
      return false;
    }

    // Rough validation: minimum moves required to reach a tile
    const minMovesForTile = Math.log2(bestTile) * 2;
    if (moves < minMovesForTile) {
      return false;
    }

    // Score should be reasonable for the bestTile achieved
    const maxReasonableScore = bestTile * bestTile * 2;
    if (score > maxReasonableScore) {
      return false;
    }

    return true;
  }
}

module.exports = new RedditAPIService();
