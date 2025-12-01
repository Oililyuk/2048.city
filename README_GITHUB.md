# 2048.city

> A modern 2048 game with Reddit community integration

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

Play the classic 2048 puzzle game with beautiful liquid glass effects and share your achievements with the Reddit community at [r/2048city](https://www.reddit.com/r/2048city).

## ✨ Features

- 🎮 **Classic 2048 Gameplay** - Smooth animations and responsive controls
- 🤖 **Reddit Integration** - Login with Reddit and share your scores
- 🏆 **Achievement System** - Unlock badges for reaching milestones
- 📱 **Mobile Optimized** - Works great on all devices
- 🎨 **Beautiful UI** - iOS-style liquid glass effects
- ↩️ **Undo System** - Strategic undo moves for better gameplay

## 🚀 Quick Start

### Play Online

Visit [2048.city](https://2048.city) to play now! *(Coming soon after Reddit API approval)*

### Local Development

```bash
# Clone the repository
git clone https://github.com/Oililyuk/2048.city.git
cd 2048.city

# Install dependencies
npm install

# Setup (copies static files and creates .env)
chmod +x setup.sh
./setup.sh

# Configure Reddit API credentials in .env
# Then start the development server
npm run dev
```

Visit http://localhost:3000/app to play!

## 📖 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get up and running in 5 minutes
- **[Architecture](ARCHITECTURE.md)** - Technical design and system overview
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production
- **[Reddit API Application](REDDIT_API_APPLICATION.md)** - Our Reddit API usage policy

## 🎮 How to Play

1. **Objective**: Combine tiles to reach 2048!
2. **Controls**:
   - Desktop: Arrow keys or WASD
   - Mobile: Swipe in any direction
3. **Login**: Click "Login with Reddit" to enable score sharing
4. **Share**: Post your achievements to r/2048city with one click

## 🏗️ Tech Stack

### Frontend
- Vanilla JavaScript (ES6+)
- HTML5 & CSS3
- Liquid glass effects

### Backend
- Node.js 16+
- Express.js
- Reddit OAuth 2.0
- Axios

## 🔒 Privacy & Security

- ✅ No personal data collection
- ✅ Secure OAuth 2.0 flow
- ✅ CSRF protection
- ✅ Rate limiting (3 shares/hour)
- ✅ Score validation
- ✅ Open source and transparent

We only access public Reddit information (username, karma) with your explicit permission.

## 📱 Reddit Integration

### Required Permissions
- `identity` - Get your Reddit username
- `submit` - Share scores to r/2048city

### What We Post
```markdown
🎯 Just reached 2048! Score: 12,345

📊 Game Stats:
- 🏆 Best Tile: 2048
- 🎯 Total Moves: 1,234
- ⏱️ Play Time: 6m 0s
```

Posts are only created when you explicitly click "Share to Reddit".

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original 2048 game by [Gabriele Cirulli](https://github.com/gabrielecirulli/2048)
- Inspired by 1024 by Veewo Studio
- Reddit API for community integration

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/Oililyuk/2048.city/issues)
- **Discussions**: [r/2048city](https://www.reddit.com/r/2048city)
- **Email**: [Your Email]

## 🌟 Star History

If you like this project, please consider giving it a ⭐ on GitHub!

---

Built with ❤️ for the 2048 community
