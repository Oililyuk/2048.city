/**
 * Score Formatter Service
 * Formats game scores for Reddit posts
 */

class ScoreFormatter {
  /**
   * Format play time in seconds to readable string
   * @param {number} seconds - Play time in seconds
   * @returns {string} Formatted time
   */
  formatPlayTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  /**
   * Format number with commas
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Generate Reddit post title
   * @param {object} scoreData - Score data
   * @returns {string} Post title
   */
  generateTitle(scoreData) {
    const { score, bestTile } = scoreData;
    const formattedScore = this.formatNumber(score);

    const emojis = {
      2048: '🎯',
      4096: '🔥',
      8192: '⚡',
      16384: '💎',
      32768: '👑'
    };

    const emoji = emojis[bestTile] || '🎮';

    if (bestTile >= 2048) {
      return `${emoji} Just reached ${this.formatNumber(bestTile)}! Score: ${formattedScore}`;
    } else {
      return `${emoji} Scored ${formattedScore} points in 2048!`;
    }
  }

  /**
   * Generate Reddit post body
   * @param {object} scoreData - Score data
   * @param {string} username - Reddit username
   * @returns {string} Post body in markdown
   */
  generatePostBody(scoreData, username) {
    const { score, bestTile, moves, playTime } = scoreData;

    const formattedScore = this.formatNumber(score);
    const formattedMoves = this.formatNumber(moves);
    const formattedTime = this.formatPlayTime(playTime || 0);

    return `I just scored **${formattedScore}** points in Wicked 2048!

📊 **Game Stats:**
- 🏆 Best Tile: **${this.formatNumber(bestTile)}**
- 🎯 Total Moves: **${formattedMoves}**
${playTime ? `- ⏱️ Play Time: **${formattedTime}**` : ''}

Think you can beat my score? 🚀

---
Play now at [2048.city](https://wicked.today) | Shared by u/${username}`;
  }

  /**
   * Get achievement badge based on best tile
   * @param {number} bestTile - Best tile achieved
   * @returns {string} Achievement name
   */
  getAchievement(bestTile) {
    const achievements = {
      2048: 'First Victory',
      4096: 'Power Player',
      8192: 'Expert',
      16384: 'Master',
      32768: 'Legend'
    };

    return achievements[bestTile] || null;
  }

  /**
   * Validate and format score data for posting
   * @param {object} scoreData - Raw score data
   * @returns {object} Formatted score data
   */
  formatScoreData(scoreData) {
    return {
      score: parseInt(scoreData.score) || 0,
      bestTile: parseInt(scoreData.bestTile) || 2,
      moves: parseInt(scoreData.moves) || 0,
      playTime: parseInt(scoreData.playTime) || 0
    };
  }
}

module.exports = new ScoreFormatter();
