/**
 * 2048.city Main Application
 * Extends Game2048 with Reddit integration
 */

class GameWithReddit extends Game2048 {
  constructor() {
    super();
    
    this.startTime = Date.now();
    this.moveCount = 0;
    this.hasShownShareDialog = false;
    
    // Track moves for statistics
    this.originalMove = this.move.bind(this);
  }

  /**
   * Override move to track statistics
   */
  move(direction) {
    const result = this.originalMove(direction);
    if (result !== false) {
      this.moveCount++;
    }
    return result;
  }

  /**
   * Override restart to reset statistics
   */
  restart() {
    super.restart();
    this.startTime = Date.now();
    this.moveCount = 0;
    this.hasShownShareDialog = false;
  }

  /**
   * Get game statistics
   */
  getStats() {
    const playTime = Math.floor((Date.now() - this.startTime) / 1000);
    
    // Find best tile
    let bestTile = 2;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] && this.grid[i][j].value > bestTile) {
          bestTile = this.grid[i][j].value;
        }
      }
    }

    return {
      score: this.score,
      bestTile: bestTile,
      moves: this.moveCount,
      playTime: playTime
    };
  }

  /**
   * Override showMessage to add share button for authenticated users
   */
  showMessage(text, className) {
    super.showMessage(text, className);
    
    // Add share button if user is authenticated and game is over
    if ((className === 'game-won' || className === 'game-over') && 
        redditAuth.isAuthenticated() && 
        !this.hasShownShareDialog) {
      
      this.hasShownShareDialog = true;
      
      // Add share button to message
      const messageContainer = document.getElementById('game-message');
      const shareButton = document.createElement('button');
      shareButton.className = 'restart-button';
      shareButton.textContent = '📤 Share to Reddit';
      shareButton.style.marginTop = '10px';
      shareButton.onclick = () => this.showShareDialog();
      
      messageContainer.appendChild(shareButton);
    }
  }

  /**
   * Show share dialog
   */
  showShareDialog() {
    const stats = this.getStats();
    
    // Update preview
    document.getElementById('preview-score').textContent = stats.score.toLocaleString();
    document.getElementById('preview-tile').textContent = stats.bestTile.toLocaleString();
    document.getElementById('preview-moves').textContent = stats.moves.toLocaleString();
    
    // Show dialog
    document.getElementById('share-overlay').classList.add('active');
    document.getElementById('share-dialog').classList.add('active');
  }

  /**
   * Hide share dialog
   */
  hideShareDialog() {
    document.getElementById('share-overlay').classList.remove('active');
    document.getElementById('share-dialog').classList.remove('active');
  }

  /**
   * Share score to Reddit
   */
  async shareToReddit() {
    const shareBtn = document.getElementById('confirm-share');
    const shareText = document.getElementById('share-text');
    const shareLoading = document.getElementById('share-loading');
    
    // Disable button and show loading
    shareBtn.disabled = true;
    shareText.style.display = 'none';
    shareLoading.style.display = 'inline-block';

    try {
      const stats = this.getStats();
      const token = redditAuth.getAccessToken();

      const response = await fetch('/api/scores/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(stats)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Hide dialog
        this.hideShareDialog();
        
        // Show success message with link
        this.showSuccessMessage(data.postUrl);
        
        // Show achievement if any
        if (data.achievement) {
          this.showAchievement(data.achievement);
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to share score');
      }
    } catch (error) {
      console.error('Share error:', error);
      alert(`Failed to share: ${error.message}`);
    } finally {
      // Re-enable button
      shareBtn.disabled = false;
      shareText.style.display = 'inline';
      shareLoading.style.display = 'none';
    }
  }

  /**
   * Show success message with Reddit link
   */
  showSuccessMessage(postUrl) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
      <div>✅ Shared to Reddit!</div>
      <a href="${postUrl}" target="_blank" style="color: white; text-decoration: underline;">View Post</a>
    `;
    document.body.appendChild(successDiv);

    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }

  /**
   * Show achievement notification
   */
  showAchievement(achievement) {
    const achievementDiv = document.createElement('div');
    achievementDiv.className = 'success-message';
    achievementDiv.style.top = '140px';
    achievementDiv.innerHTML = `🏆 Achievement: ${achievement}`;
    document.body.appendChild(achievementDiv);

    setTimeout(() => {
      achievementDiv.remove();
    }, 4000);
  }
}

/**
 * Initialize application
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Reddit authentication
  redditAuth.init();

  // Initialize game
  window.gameApp = new GameWithReddit();

  // Setup share dialog handlers
  document.getElementById('cancel-share').addEventListener('click', () => {
    gameApp.hideShareDialog();
  });

  document.getElementById('confirm-share').addEventListener('click', () => {
    gameApp.shareToReddit();
  });

  document.getElementById('share-overlay').addEventListener('click', () => {
    gameApp.hideShareDialog();
  });

  // Add keyboard shortcut to show share dialog (Ctrl+S or Cmd+S)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (redditAuth.isAuthenticated() && gameApp.score > 0) {
        gameApp.showShareDialog();
      } else if (!redditAuth.isAuthenticated()) {
        alert('Please login with Reddit to share your score');
      }
    }
  });

  console.log('🎮 2048.city initialized');
  console.log('Press Ctrl+S (Cmd+S) to share your score');
});
