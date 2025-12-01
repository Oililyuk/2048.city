# 2048.city

2048.city is a modern, web-based implementation of the classic 2048 puzzle game with Reddit integration. Players can enjoy smooth controls, beautiful liquid glass effects, and share their high scores directly to the Reddit community at [r/2048city](https://www.reddit.com/r/2048city).

## ✨ Features

### Game Features
- 🎮 **Classic 2048 gameplay** with smooth animations and liquid glass effects
- ⌨️ **Multiple control methods**: arrow keys, WASD keys, or swipe gestures
- ↩️ **Undo system**: Get undo opportunities by reaching 256+ tiles
- 📱 **Fully responsive**: Optimized for desktop and mobile devices
- 🎨 **Beautiful UI**: iOS-style liquid glass effects throughout

### Reddit Integration (NEW!)
- 🤖 **Login with Reddit**: Secure OAuth2 authentication
- 📤 **Share scores**: Post your achievements to [r/2048city](https://www.reddit.com/r/2048city)
- 🏆 **Achievement system**: Unlock badges for reaching milestones
- 👥 **Community**: Join the Reddit community and compete with others
- 🔒 **Privacy-focused**: Posts only when you explicitly choose to share

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Reddit account (for sharing features)

### Installation

```bash
# Clone the repository
git clone https://github.com/Oililyuk/2048.git
cd 2048

# Run setup script (recommended)
chmod +x setup.sh
./setup.sh

# Or manually:
npm install
cp .env.example .env
# Edit .env with your Reddit API credentials

# Start the development server
npm run dev
```

The application will be available at:
- **New app with Reddit**: http://localhost:3000/app
- **Original game**: http://localhost:3000/

### Configuration

1. **Get Reddit API Credentials**:
   - Visit https://www.reddit.com/prefs/apps
   - Create a new "web app"
   - Set redirect URI to: `http://localhost:3000/api/auth/reddit/callback`
   - Copy your Client ID and Secret

2. **Configure Environment**:
   - Edit `.env` file
   - Add your Reddit credentials:
     ```env
     REDDIT_CLIENT_ID=your_client_id
     REDDIT_CLIENT_SECRET=your_secret
     ```

3. **Start Playing**:
   - Visit http://localhost:3000/app
   - Login with Reddit (optional)
   - Play and share your scores!

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)**: 5-minute setup guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)**: System design and architecture
- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Production deployment guide

## 🎮 How to Play

1. **Goal**: Combine tiles to reach 2048!
2. **Controls**:
   - Desktop: Arrow keys or WASD
   - Mobile: Swipe in any direction
3. **Merging**: When two tiles with the same number touch, they merge
4. **Undo**: Earn undo moves by reaching higher tiles (256+)
5. **Share**: Login with Reddit to share your achievements

## 🏗️ Architecture

This project uses a modern client-server architecture:

### Frontend (`/public`)
- HTML5 with liquid glass CSS effects
- Vanilla JavaScript (no framework dependencies)
- Reddit OAuth client
- Game logic separated into modules

### Backend (`/server`)
- Node.js + Express server
- Reddit OAuth2 flow
- Score validation and submission
- Rate limiting (3 shares per hour)

### APIs
- `GET /api/auth/reddit` - Initiate Reddit login
- `POST /api/scores/share` - Share score to Reddit
- `GET /api/user/me` - Get user information

## 🔒 Security Features

- ✅ CSRF protection with state parameter
- ✅ Server-side token management
- ✅ Score validation (anti-cheat)
- ✅ Rate limiting
- ✅ HTTPS required in production
- ✅ HttpOnly cookies for sensitive data

## 🌐 Reddit Integration

### OAuth Flow
1. User clicks "Login with Reddit"
2. Redirects to Reddit authorization page
3. User authorizes the app
4. Reddit redirects back with authorization code
5. Server exchanges code for access token
6. User can now share scores

### Sharing Process
1. Complete a game
2. Click "Share to Reddit"
3. Preview score and stats
4. Confirm to post to r/2048city
5. Get direct link to your post

### Post Format
```markdown
🎯 Just reached 2048! Score: 12,345

📊 Game Stats:
- 🏆 Best Tile: 2048
- 🎯 Total Moves: 1,234
- ⏱️ Play Time: 6m 0s

Play now at https://2048.city
```

## 🚢 Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on:
- Vercel deployment
- VPS setup (DigitalOcean, AWS, etc.)
- Railway deployment
- Environment configuration
- SSL setup

## 🛠️ Development

### Project Structure

```
2048/
├── server/              # Backend API
│   ├── index.js        # Express server
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── middleware/     # Auth & error handling
│   └── config/         # Configuration
├── public/             # Frontend
│   ├── app.html       # Main application
│   ├── app.js         # App logic
│   ├── reddit-auth.js # Auth client
│   ├── game-core.js   # Game engine
│   └── style.css      # Styles
├── index.html         # Original game (preserved)
├── script.js          # Original game logic
└── package.json       # Dependencies
```

### Scripts

```bash
npm run dev      # Start development server with auto-reload
npm start        # Start production server
```

### Key Technologies

- **Frontend**: Vanilla JS, CSS3, HTML5
- **Backend**: Node.js, Express
- **Authentication**: Reddit OAuth 2.0
- **HTTP Client**: Axios
- **Session**: express-session

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- [ ] Leaderboard system
- [ ] Achievement tracking
- [ ] Custom themes
- [ ] Multiplayer mode
- [ ] Daily challenges
- [ ] Game replay feature

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🔗 Links

- **Play Online**: https://2048.city
- **Reddit Community**: [r/2048city](https://www.reddit.com/r/2048city)
- **Report Issues**: [GitHub Issues](https://github.com/Oililyuk/2048/issues)

## 🙏 Acknowledgments

- Original 2048 game by Gabriele Cirulli
- Reddit API for community integration
- The r/2048city community

## 📞 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Use GitHub Issues
- **Reddit**: Post in r/2048city

---

Made with ❤️ for the 2048 community | Share your high scores! 🚀
