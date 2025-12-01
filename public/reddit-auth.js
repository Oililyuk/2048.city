/**
 * Reddit Authentication Client
 * Handles Reddit OAuth flow and user authentication
 */

class RedditAuth {
  constructor() {
    this.apiBase = '/api';
    this.accessToken = localStorage.getItem('reddit_access_token');
    this.refreshToken = localStorage.getItem('reddit_refresh_token');
    this.username = localStorage.getItem('reddit_username');
    this.tokenExpiry = localStorage.getItem('reddit_token_expiry');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    if (!this.accessToken || !this.username) {
      return false;
    }

    // Check if token is expired
    if (this.tokenExpiry) {
      const now = Date.now();
      if (now >= parseInt(this.tokenExpiry)) {
        // Token expired, try to refresh
        this.refreshAccessToken();
        return false;
      }
    }

    return true;
  }

  /**
   * Get current username
   * @returns {string|null}
   */
  getUsername() {
    return this.username;
  }

  /**
   * Get access token
   * @returns {string|null}
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Initiate Reddit login
   */
  login() {
    // Redirect to backend auth endpoint
    window.location.href = `${this.apiBase}/auth/reddit`;
  }

  /**
   * Handle OAuth callback
   * Called when user returns from Reddit authorization
   */
  handleCallback() {
    const params = new URLSearchParams(window.location.search);
    
    const error = params.get('error');
    if (error) {
      this.showError(`Authentication failed: ${error}`);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    const authenticated = params.get('authenticated');
    const token = params.get('token');
    const username = params.get('username');

    if (authenticated === 'true' && token && username) {
      // Store authentication data
      this.accessToken = token;
      this.username = decodeURIComponent(username);
      
      localStorage.setItem('reddit_access_token', this.accessToken);
      localStorage.setItem('reddit_username', this.username);
      
      // Set expiry (1 hour from now)
      const expiry = Date.now() + (60 * 60 * 1000);
      this.tokenExpiry = expiry.toString();
      localStorage.setItem('reddit_token_expiry', this.tokenExpiry);

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Update UI
      this.updateUI();
      this.showSuccess(`Welcome back, ${this.username}! 🎉`);
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call logout endpoint
      await fetch(`${this.apiBase}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Clear local storage
    localStorage.removeItem('reddit_access_token');
    localStorage.removeItem('reddit_refresh_token');
    localStorage.removeItem('reddit_username');
    localStorage.removeItem('reddit_token_expiry');

    this.accessToken = null;
    this.refreshToken = null;
    this.username = null;
    this.tokenExpiry = null;

    // Update UI
    this.updateUI();
    this.showSuccess('Logged out successfully');
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken() {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.apiBase}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.accessToken;
        localStorage.setItem('reddit_access_token', this.accessToken);
        
        // Update expiry
        const expiry = Date.now() + (data.expiresIn * 1000);
        this.tokenExpiry = expiry.toString();
        localStorage.setItem('reddit_token_expiry', this.tokenExpiry);

        return true;
      } else {
        // Refresh failed, logout
        await this.logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  /**
   * Get user information
   * @returns {Promise<object>}
   */
  async getUserInfo() {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.apiBase}/user/me`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      } else if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.getUserInfo(); // Retry
        }
        throw new Error('Authentication expired');
      } else {
        throw new Error('Failed to get user info');
      }
    } catch (error) {
      console.error('Get user info error:', error);
      throw error;
    }
  }

  /**
   * Update UI based on authentication status
   */
  updateUI() {
    const userInfoDiv = document.getElementById('user-info');
    const authButtonsDiv = document.getElementById('auth-buttons');

    if (this.isAuthenticated()) {
      // Show user info
      authButtonsDiv.innerHTML = `
        <span class="username">u/${this.username}</span>
        <button class="btn-logout" id="logout-btn">Logout</button>
      `;

      // Add logout handler
      document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    } else {
      // Show login button
      authButtonsDiv.innerHTML = `
        <a href="#" class="btn-reddit-login" id="login-btn">Login with Reddit</a>
      `;

      // Add login handler
      document.getElementById('login-btn').addEventListener('click', (e) => {
        e.preventDefault();
        this.login();
      });
    }
  }

  /**
   * Show success message
   * @param {string} message
   */
  showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }

  /**
   * Show error message
   * @param {string} message
   */
  showError(message) {
    alert(message); // Simple alert for now, can be improved
  }

  /**
   * Initialize authentication
   */
  init() {
    // Handle OAuth callback if present
    this.handleCallback();

    // Update UI
    this.updateUI();

    // Auto-refresh token before expiry
    if (this.isAuthenticated() && this.tokenExpiry) {
      const now = Date.now();
      const expiry = parseInt(this.tokenExpiry);
      const timeUntilExpiry = expiry - now;
      
      // Refresh 5 minutes before expiry
      const refreshTime = timeUntilExpiry - (5 * 60 * 1000);
      
      if (refreshTime > 0) {
        setTimeout(() => {
          this.refreshAccessToken();
        }, refreshTime);
      }
    }
  }
}

// Create global instance
const redditAuth = new RedditAuth();
