import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendRecordEmail(
  to: string,
  name: string,
  score: number
) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return;
  }
  
  try {
    await resend.emails.send({
      from: '2048.city <noreply@2048.city>',
      to,
      subject: `🎉 New High Score: ${score.toLocaleString()} on 2048.city!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            h1 {
              color: #333;
              font-size: 32px;
              margin: 0 0 20px 0;
              text-align: center;
            }
            .trophy {
              text-align: center;
              font-size: 64px;
              margin: 20px 0;
            }
            .score {
              text-align: center;
              font-size: 48px;
              font-weight: bold;
              color: #667eea;
              margin: 20px 0;
            }
            p {
              color: #666;
              font-size: 16px;
              line-height: 1.6;
              margin: 15px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              padding: 15px 40px;
              border-radius: 10px;
              font-weight: 600;
              margin: 30px 0;
              text-align: center;
            }
            .button-container {
              text-align: center;
            }
            .footer {
              text-align: center;
              color: #999;
              font-size: 12px;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="trophy">🏆</div>
            <h1>Congratulations, ${name}!</h1>
            <p>You've achieved a new personal high score!</p>
            <div class="score">${score.toLocaleString()}</div>
            <p>Keep playing to climb the leaderboard and challenge yourself to reach new heights!</p>
            <div class="button-container">
              <a href="https://2048.city" class="button">Play Again</a>
              <a href="https://2048.city/leaderboard" class="button">View Leaderboard</a>
            </div>
            <div class="footer">
              <p>2048.city - Free 2048 Game Online</p>
              <p>You received this email because you play on 2048.city</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    
    console.log(`Email sent to ${to} for score ${score}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(
  to: string,
  name: string
) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return;
  }
  
  try {
    await resend.emails.send({
      from: '2048.city <noreply@2048.city>',
      to,
      subject: 'Welcome to 2048.city! 🎮',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            h1 {
              color: #333;
              font-size: 32px;
              margin: 0 0 20px 0;
            }
            p {
              color: #666;
              font-size: 16px;
              line-height: 1.6;
              margin: 15px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              padding: 15px 40px;
              border-radius: 10px;
              font-weight: 600;
              margin: 30px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to 2048.city, ${name}! 🎮</h1>
            <p>Thank you for signing up! You're now part of our community.</p>
            <p>Features you'll enjoy:</p>
            <ul>
              <li>🏆 Compete on global leaderboards</li>
              <li>📊 Track your personal records</li>
              <li>📧 Get notifications for new high scores</li>
              <li>📱 Share your achievements</li>
            </ul>
            <a href="https://2048.city" class="button">Start Playing</a>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}
