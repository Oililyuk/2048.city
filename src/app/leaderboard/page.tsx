import { Metadata } from 'next';
import Leaderboard from '@/components/Leaderboard/Leaderboard';

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'Top players and highest scores on 2048.city',
};

export default function LeaderboardPage() {
  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '40px 20px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.95)'
      }}>
        🏆 Leaderboard
      </h1>
      <Leaderboard autoOpen={true} />
    </div>
  );
}
