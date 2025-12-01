/**
 * Authentication Routes
 * Handles Reddit OAuth flow
 */

const express = require('express');
const crypto = require('crypto');
const redditAPI = require('../services/reddit-api');
const redditConfig = require('../config/reddit');

const router = express.Router();

/**
 * GET /api/auth/reddit
 * Initiate Reddit OAuth flow
 */
router.get('/reddit', (req, res) => {
  try {
    // Check if Reddit is configured
    if (!redditConfig.isConfigured()) {
      return res.status(500).json({
        error: 'Configuration Error',
        message: 'Reddit API is not properly configured',
        details: redditConfig.getConfigErrors()
      });
    }

    // Generate random state for CSRF protection
    const state = crypto.randomBytes(16).toString('hex');
    
    // Store state in session
    req.session.oauthState = state;

    // Generate authorization URL
    const authUrl = redditAPI.getAuthorizationUrl(state);

    // Redirect to Reddit authorization page
    res.redirect(authUrl);
  } catch (error) {
    console.error('Reddit auth initiation error:', error);
    res.status(500).json({
      error: 'Authentication Error',
      message: 'Failed to initiate Reddit authentication'
    });
  }
});

/**
 * GET /api/auth/reddit/callback
 * Reddit OAuth callback
 */
router.get('/reddit/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;

    // Check for Reddit error
    if (error) {
      return res.redirect(`/app?error=${encodeURIComponent(error)}`);
    }

    // Verify state parameter (CSRF protection)
    if (!state || state !== req.session.oauthState) {
      return res.redirect('/app?error=invalid_state');
    }

    // Clear the state from session
    delete req.session.oauthState;

    // Exchange code for access token
    const tokenData = await redditAPI.exchangeCodeForToken(code);

    // Get user information
    const userInfo = await redditAPI.getUserInfo(tokenData.accessToken);

    // Store tokens in session (or you could use a database)
    req.session.accessToken = tokenData.accessToken;
    req.session.refreshToken = tokenData.refreshToken;
    req.session.username = userInfo.username;

    // Redirect to app with success
    res.redirect(
      `/app?authenticated=true&username=${encodeURIComponent(userInfo.username)}&token=${encodeURIComponent(tokenData.accessToken)}`
    );
  } catch (error) {
    console.error('Reddit callback error:', error);
    res.redirect(`/app?error=authentication_failed`);
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Refresh token is required'
      });
    }

    // Refresh the token
    const newTokenData = await redditAPI.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      accessToken: newTokenData.accessToken,
      expiresIn: newTokenData.expiresIn
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Failed to refresh token'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: 'Logout Failed',
        message: 'Failed to logout'
      });
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

/**
 * GET /api/auth/status
 * Check authentication status
 */
router.get('/status', (req, res) => {
  const isAuthenticated = !!(req.session.accessToken && req.session.username);

  res.json({
    authenticated: isAuthenticated,
    username: req.session.username || null
  });
});

module.exports = router;
