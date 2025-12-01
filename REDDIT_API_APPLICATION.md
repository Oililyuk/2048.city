# 2048.city - Reddit API Integration Application

## Application Overview

2048.city is a modern web-based implementation of the classic 2048 puzzle game with Reddit OAuth integration. This application allows users to authenticate with their Reddit accounts and share their game achievements to the r/2048city community.

## Purpose of Reddit API Access

We are requesting Reddit API access to provide the following features:

### 1. User Authentication
- Allow users to log in using Reddit OAuth 2.0
- Access basic user information (username, karma, account age)
- Required scope: `identity`

### 2. Score Sharing
- Enable users to share their game achievements to r/2048city subreddit
- Post formatted game statistics (score, best tile, moves, play time)
- Required scope: `submit`

### 3. Community Engagement
- Foster a community around the 2048 game
- Allow players to compete and share strategies
- Build engagement in r/2048city

## Technical Implementation

### OAuth 2.0 Flow
1. User clicks "Login with Reddit"
2. Redirect to Reddit authorization page
3. User grants permissions (`identity` and `submit` scopes)
4. Reddit redirects back with authorization code
5. Server exchanges code for access token
6. Token stored securely for API requests

### API Endpoints Used
- `POST /api/v1/access_token` - Exchange authorization code for token
- `GET /api/v1/me` - Get authenticated user information
- `POST /api/submit` - Submit text post to r/2048city

### Security Measures
- CSRF protection using state parameter
- Secure token storage (HttpOnly cookies for refresh tokens)
- Server-side token exchange (client secret never exposed)
- Rate limiting: Maximum 3 posts per user per hour
- Score validation to prevent spam/cheating

## User Privacy and Data Usage

### Data We Collect
- Reddit username (public information)
- Reddit karma (public information)
- Account creation date (public information)

### Data We DO NOT Collect
- Email addresses
- Private messages
- Voting history
- Browsing history
- Any other private user data

### Data Storage
- Access tokens: Stored temporarily in server memory/session
- Refresh tokens: Stored in HttpOnly cookies
- No long-term storage of user data
- No user tracking across sessions

### User Control
- Users can revoke access at any time via Reddit preferences
- Posts are only made when user explicitly clicks "Share"
- Users can logout and delete local session data
- Full transparency in posted content (users see preview before posting)

## Rate Limiting and Abuse Prevention

### Client-Side Rate Limiting
- Maximum 3 score shares per user per hour
- Enforced via server-side middleware
- Clear error messages when limit reached

### Content Validation
- Score validation to detect impossible/suspicious scores
- Post formatting follows consistent template
- No user-editable content (prevents spam)
- Automatic duplicate detection

### Compliance
- Respect Reddit's API rate limits (60 requests per minute)
- Use appropriate User-Agent header
- Follow Reddit API terms of service
- No automated posting or botting

## Application Architecture

### Frontend
- Static HTML/CSS/JavaScript
- Vanilla JavaScript (no frameworks)
- Reddit OAuth client
- LocalStorage for temporary token caching

### Backend
- Node.js + Express server
- Reddit API client (Axios)
- Session management (express-session)
- Environment-based configuration

### Deployment
- Hosted on Vercel/Railway (will be determined)
- HTTPS only (required for OAuth)
- Environment variables for sensitive data
- Separate development and production configurations

## Post Format Example

When a user shares their score, the following post is created in r/2048city:

**Title:**
```
🎯 Just reached 2048! Score: 12,345
```

**Body:**
```markdown
I just scored **12,345** points in Wicked 2048!

📊 Game Stats:
- 🏆 Best Tile: 2048
- 🎯 Total Moves: 1,234
- ⏱️ Play Time: 6m 0s

Play now at https://2048.city

---
Shared by u/username from 2048.city
```

## Development and Testing

### Local Development
- Clone repository
- Install dependencies: `npm install`
- Configure `.env` with Reddit app credentials
- Run: `npm run dev`
- Access at: http://localhost:3000

### Testing Endpoints
- Health check: `GET /api/health`
- Auth status: `GET /api/auth/status`
- User info: `GET /api/user/me` (requires authentication)

## Contact Information

- **Developer**: [Your Name/Organization]
- **Website**: https://2048.city (will be live after approval)
- **Support Email**: [Your Email]
- **GitHub**: https://github.com/Oililyuk/2048.city
- **Target Subreddit**: r/2048city

## Compliance Statement

This application:
- ✅ Follows Reddit API Terms of Service
- ✅ Respects user privacy
- ✅ Implements proper rate limiting
- ✅ Uses OAuth 2.0 securely
- ✅ Provides clear user consent flow
- ✅ Does not automate actions
- ✅ Does not scrape Reddit data
- ✅ Does not track users
- ✅ Provides clear terms of use
- ✅ Allows easy access revocation

## Future Plans

### Phase 1 (Current)
- Basic OAuth authentication
- Score sharing to r/2048city
- Achievement system

### Phase 2 (Planned)
- Leaderboard (reading from r/2048city posts)
- User profiles (Reddit public data only)
- Achievement badges

### Phase 3 (Possible)
- Daily challenges
- Multiplayer mode (non-Reddit)
- Custom themes

## Open Source

This project is open source under the MIT License. The complete source code is available at:
https://github.com/Oililyuk/2048.city

## Support and Documentation

- **Quick Start Guide**: See QUICKSTART.md
- **Technical Documentation**: See ARCHITECTURE.md
- **Deployment Guide**: See DEPLOYMENT.md
- **API Documentation**: See docs/API.md

## Questions or Concerns?

If you have any questions about our Reddit API usage, please contact us at [your email] or open an issue on GitHub.

---

**Thank you for reviewing our application!**

We are committed to building a positive community experience and following all Reddit API guidelines.
