/**
 * Scores Routes
 * Handles score sharing to Reddit
 */

const express = require('express');
const { authenticateToken, rateLimitSharing } = require('../middleware/auth');
const redditAPI = require('../services/reddit-api');
const scoreFormatter = require('../services/score-formatter');

const router = express.Router();

/**
 * POST /api/scores/share
 * Share score to r/2048city
 */
router.post('/share', authenticateToken, rateLimitSharing, async (req, res) => {
  try {
    const scoreData = scoreFormatter.formatScoreData(req.body);

    // Validate score data
    if (!redditAPI.validateScore(scoreData)) {
      return res.status(400).json({
        error: 'Invalid Score',
        message: 'The submitted score data appears to be invalid or suspicious'
      });
    }

    // Generate post content
    const title = scoreFormatter.generateTitle(scoreData);
    const text = scoreFormatter.generatePostBody(scoreData, req.user.username);

    // Submit to Reddit
    const postResult = await redditAPI.submitPost(req.accessToken, {
      title,
      text
    });

    // Get achievement if any
    const achievement = scoreFormatter.getAchievement(scoreData.bestTile);

    res.json({
      success: true,
      postId: postResult.postId,
      postUrl: postResult.postUrl,
      achievement: achievement,
      message: 'Score shared successfully to r/2048city!'
    });
  } catch (error) {
    console.error('Score sharing error:', error);
    
    if (error.message.includes('already submitted')) {
      return res.status(409).json({
        error: 'Duplicate Post',
        message: 'You have already shared a similar score recently'
      });
    }

    res.status(500).json({
      error: 'Sharing Failed',
      message: error.message || 'Failed to share score to Reddit'
    });
  }
});

/**
 * POST /api/scores/validate
 * Validate score without posting (for testing)
 */
router.post('/validate', authenticateToken, (req, res) => {
  try {
    const scoreData = scoreFormatter.formatScoreData(req.body);
    const isValid = redditAPI.validateScore(scoreData);

    res.json({
      valid: isValid,
      scoreData: scoreData,
      message: isValid ? 'Score is valid' : 'Score appears to be invalid'
    });
  } catch (error) {
    console.error('Score validation error:', error);
    res.status(400).json({
      error: 'Validation Error',
      message: 'Failed to validate score data'
    });
  }
});

/**
 * GET /api/scores/preview
 * Preview what the Reddit post will look like
 */
router.get('/preview', authenticateToken, (req, res) => {
  try {
    const scoreData = scoreFormatter.formatScoreData(req.query);

    const title = scoreFormatter.generateTitle(scoreData);
    const text = scoreFormatter.generatePostBody(scoreData, req.user.username);
    const achievement = scoreFormatter.getAchievement(scoreData.bestTile);

    res.json({
      title,
      text,
      achievement,
      username: req.user.username
    });
  } catch (error) {
    console.error('Preview generation error:', error);
    res.status(400).json({
      error: 'Preview Error',
      message: 'Failed to generate post preview'
    });
  }
});

module.exports = router;
