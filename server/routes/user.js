/**
 * User Routes
 * Handles user information
 */

const express = require('express');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const redditAPI = require('../services/reddit-api');

const router = express.Router();

/**
 * GET /api/user/me
 * Get current user information
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // User info is already attached by authenticateToken middleware
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'User Error',
      message: 'Failed to get user information'
    });
  }
});

/**
 * GET /api/user/stats
 * Get user statistics (mock for now, could be expanded)
 */
router.get('/stats', authenticateToken, (req, res) => {
  try {
    // This could be expanded to track user's game statistics
    // For now, return basic info
    res.json({
      success: true,
      stats: {
        username: req.user.username,
        karma: req.user.karma,
        memberSince: req.user.created,
        // These would come from a database in a real implementation
        totalGames: 0,
        totalShares: 0,
        bestScore: 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Stats Error',
      message: 'Failed to get user statistics'
    });
  }
});

module.exports = router;
