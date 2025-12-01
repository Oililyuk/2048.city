# Deployment Guide - 2048.city

This guide explains how to deploy your 2048.city application with Reddit integration.

## Prerequisites

- Node.js 16+ and npm 8+
- Reddit account
- Reddit App credentials (Client ID and Secret)

## Step 1: Set Up Reddit App

1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Fill in the form:
   - **Name**: 2048.city (or your preferred name)
   - **App type**: Select "web app"
   - **Description**: 2048 game with Reddit integration
   - **About URL**: https://your-domain.com
   - **Redirect URI**: `http://localhost:3000/api/auth/reddit/callback` (for development)
   - For production, use: `https://your-domain.com/api/auth/reddit/callback`
4. Click "Create app"
5. Note down the **client ID** (under the app name) and **client secret**

## Step 2: Local Development Setup

### 1. Install Dependencies

```bash
cd /path/to/2048
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

Fill in the following in `.env`:
```env
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_REDIRECT_URI=http://localhost:3000/api/auth/reddit/callback
SESSION_SECRET=generate_a_random_string_here
```

### 3. Copy Game Core Logic

The `public/game-core.js` file needs the complete game logic from `script.js`:

```bash
# Copy the Game2048 class from script.js to public/game-core.js
# You can do this manually or use:
head -n 1500 script.js > public/game-core.js
```

Or manually copy the entire `Game2048` class from `script.js` into `public/game-core.js`.

### 4. Copy Static Assets

```bash
# Copy the stylesheet
cp style.css public/style.css

# Copy assets folder
cp -r asset public/asset
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at:
- New app with Reddit: http://localhost:3000/app
- Original game: http://localhost:3000/
- API health check: http://localhost:3000/api/health

## Step 3: Testing Reddit Integration

1. Visit http://localhost:3000/app
2. Click "Login with Reddit"
3. Authorize the app on Reddit
4. Play the game
5. When game ends, click "Share to Reddit"
6. Check r/2048city for your post

## Step 4: Production Deployment

### Option A: Vercel (Recommended for Serverless)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "public/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. Set environment variables in Vercel:
```bash
vercel env add REDDIT_CLIENT_ID
vercel env add REDDIT_CLIENT_SECRET
vercel env add SESSION_SECRET
```

4. Deploy:
```bash
vercel --prod
```

5. Update Reddit app redirect URI to your Vercel URL:
   - Go to https://www.reddit.com/prefs/apps
   - Edit your app
   - Change redirect URI to: `https://your-app.vercel.app/api/auth/reddit/callback`

### Option B: Traditional VPS (DigitalOcean, AWS, etc.)

1. SSH into your server
2. Install Node.js 16+
3. Clone your repository
4. Install dependencies: `npm install`
5. Create `.env` file with production values
6. Use PM2 to run the app:
```bash
npm install -g pm2
pm2 start server/index.js --name 2048-city
pm2 save
pm2 startup
```

7. Set up Nginx as reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. Set up SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option C: Railway

1. Create account at https://railway.app
2. Create new project
3. Connect your GitHub repository
4. Add environment variables in Railway dashboard
5. Railway will auto-deploy on push

## Step 5: Update Reddit App for Production

1. Go to https://www.reddit.com/prefs/apps
2. Edit your app
3. Update redirect URI to production URL:
   ```
   https://your-production-domain.com/api/auth/reddit/callback
   ```
4. Update `.env` on server:
   ```env
   REDDIT_REDIRECT_URI=https://your-production-domain.com/api/auth/reddit/callback
   FRONTEND_URL=https://your-production-domain.com
   NODE_ENV=production
   ```

## Security Checklist

- [ ] Generate strong random `SESSION_SECRET`
- [ ] Never commit `.env` to version control
- [ ] Use HTTPS in production (required for Reddit OAuth)
- [ ] Set `NODE_ENV=production` in production
- [ ] Configure CORS properly for your domain
- [ ] Keep Reddit API credentials secure
- [ ] Regularly update dependencies

## Monitoring

### Check server status:
```bash
curl https://your-domain.com/api/health
```

### View logs:
```bash
# PM2
pm2 logs 2048-city

# Vercel
vercel logs

# Railway
railway logs
```

## Troubleshooting

### "Reddit authentication failed"
- Check if Reddit app credentials are correct
- Verify redirect URI matches exactly (including http/https)
- Ensure app type is "web app" on Reddit

### "Token expired" errors
- Check if SESSION_SECRET is set
- Verify token refresh logic is working
- Check server logs for token refresh errors

### CORS errors
- Ensure FRONTEND_URL matches your actual domain
- Check CORS configuration in server/index.js
- Verify credentials: true in CORS options

### Rate limiting issues
- Users are limited to 3 shares per hour
- This is enforced server-side
- Check middleware/auth.js for rate limit settings

## Support

For issues:
1. Check server logs
2. Test with `curl` or Postman
3. Verify environment variables
4. Check Reddit app status at https://www.reddit.com/prefs/apps

## Next Steps

After deployment:
1. Test all functionality (login, play, share)
2. Share your app URL on r/2048city
3. Monitor for errors and user feedback
4. Consider adding analytics
5. Plan feature updates (see ARCHITECTURE.md)
