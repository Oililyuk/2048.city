# 2048.city

2048.city is a free, web-based implementation of the classic 2048 puzzle game. Players can enjoy smooth controls, a beautiful interface, and addictive gameplay, either directly on the website or embedded in Reddit via OAuth login.

## Features

- **Play the classic 2048 game** with a clean, modern interface.
- **Easy controls**: arrow keys or swipe gestures.
- **Track and share scores** with Reddit integration.
- **User authentication**: login securely with your Reddit account via OAuth.
- **Community engagement**: share your high scores directly to the subreddit [r/2048city](https://www.reddit.com/r/2048city).

## Reddit Integration

2048.city integrates with Reddit using OAuth to authenticate users and allow them to post scores. Key functionality includes:

1. **Login with Reddit**: Users authenticate via OAuth with `identity` and `submit` scopes.
2. **Score submission**: After playing, users can click “Share to Reddit” to post their high score to [r/2048city](https://www.reddit.com/r/2048city).
3. **User-controlled posting**: Posts are only made when the user explicitly chooses to share their score.
4. **Server-side handling**: The backend exchanges the OAuth code for an access token, verifies identity, and submits the score via the Reddit API (`/api/submit`).

## Installation & Development

```bash
# Clone the repository
git clone https://github.com/<your-username>/2048.city.git
cd 2048.city

# Install dependencies
npm install

# Start the development server
npm run dev
