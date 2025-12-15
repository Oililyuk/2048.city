import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Win 2048: Complete Strategy Guide | 2048.city',
  description: 'Master 2048 with proven strategies! Learn the corner technique, snake pattern, common mistakes, and advanced tactics. Step-by-step guide for beginners to experts.'
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
export const themeColor = '#000000';

export default function HowToWin2048Page() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>How to Win 2048: Complete Strategy Guide</h1>
      <p><b>Last updated: December 15, 2025</b> | <b>Reading time: 7 minutes</b></p>
      
      <p>2048 is deceptively simple yet endlessly challenging. This comprehensive guide teaches proven techniques to consistently reach 2048, 4096, and beyond.</p>
      
      <p><strong>What you'll learn:</strong> Core strategies • Corner technique • Snake pattern • Common mistakes • Advanced tactics • Practice drills</p>

      <h2>1. Game Mechanics: The Basics</h2>
      <ul>
        <li><strong>Movement:</strong> Arrow keys (desktop) or swipe (mobile) moves ALL tiles simultaneously</li>
        <li><strong>Merging:</strong> Identical numbers combine into their sum (2+2=4, 4+4=8, etc.)</li>
        <li><strong>New tiles:</strong> After each move, a 2 (90%) or 4 (10%) appears randomly</li>
        <li><strong>Goal:</strong> Create a 2048 tile (continue for 4096, 8192, or higher)</li>
        <li><strong>Game over:</strong> Board fills with no possible merges</li>
      </ul>

      <h2>2. The Corner Strategy (Essential!)</h2>
      <h3>Why Corners Matter</h3>
      <p>Keeping your highest tile in a corner prevents it from being trapped by smaller tiles. This is THE fundamental strategy that separates winners from losers.</p>
      
      <h3>Step 1: Choose Your Corner</h3>
      <p>Pick any corner (bottom-right is popular) and <strong>never move your highest tile from there</strong>. Commit to this for the entire game.</p>
      
      <h3>Step 2: Two-Direction Rule</h3>
      <p>For bottom-right corner, use primarily <strong>DOWN</strong> and <strong>RIGHT</strong> (90% of moves). Use LEFT occasionally for setup. Avoid UP unless absolutely necessary.</p>
      
      <h3>Step 3: Build in Descending Order</h3>
      <p>Arrange tiles from highest to lowest extending from your corner:</p>
      <ul>
        <li>Bottom row: 1024 → 512 → 256 → 128</li>
        <li>Second row: 64 → 32 → 16 → 8</li>
        <li>Keep this pattern consistent!</li>
      </ul>

      <h2>3. The Snake Pattern</h2>
      <p>Visualize tiles flowing in a "zigzag" from your corner:</p>
      <ul>
        <li><strong>Row 1 (bottom):</strong> Highest → 2nd → 3rd → 4th</li>
        <li><strong>Row 2:</strong> 8th → 7th → 6th → 5th</li>
        <li><strong>Row 3:</strong> 9th → 10th → 11th → 12th</li>
        <li><strong>Row 4 (top):</strong> Smallest tiles + empty spaces</li>
      </ul>
      <p>This pattern maximizes merging opportunities and minimizes tile conflicts.</p>

      <h2>4. Common Mistakes (Avoid These!)</h2>
      
      <h3>❌ Mistake #1: Random Movement</h3>
      <p><strong>Why it fails:</strong> Destroys your tile organization.</p>
      <p><strong>Fix:</strong> Before each move, ask "Does this help my corner strategy?"</p>
      
      <h3>❌ Mistake #2: Breaking the Corner</h3>
      <p><strong>Why it fails:</strong> Moving your highest tile away is often game-ending.</p>
      <p><strong>Fix:</strong> Protect your corner at all costs. Use undo if needed.</p>
      
      <h3>❌ Mistake #3: Ignoring Small Tiles</h3>
      <p><strong>Why it fails:</strong> Scattered 2s and 4s waste space.</p>
      <p><strong>Fix:</strong> Regularly merge small tiles to keep the board clean.</p>
      
      <h3>❌ Mistake #4: Filling the Board</h3>
      <p><strong>Why it fails:</strong> No room for new tiles = game over.</p>
      <p><strong>Fix:</strong> Maintain 2-4 empty spaces for breathing room.</p>

      <h2>5. Advanced Techniques</h2>
      
      <h3>Lookahead Planning</h3>
      <p>Think 2-3 moves ahead. Simulate: "If I go DOWN, where will the new tile spawn? Can I handle it?"</p>
      
      <h3>Combo Moves</h3>
      <p>Look for moves that merge multiple pairs simultaneously. Example: DOWN that combines 2+2 AND 4+4 is more valuable than a single-merge move.</p>
      
      <h3>Emergency Recovery</h3>
      <p>If your pattern breaks:</p>
      <ul>
        <li>Create space by merging small tiles</li>
        <li>Gradually reposition highest tile back to corner</li>
        <li>Sacrifice short-term score for long-term organization</li>
      </ul>

      <h2>6. Your First Win: Step-by-Step</h2>
      <ol>
        <li><strong>Moves 1-20:</strong> Choose bottom-right, use only DOWN+RIGHT</li>
        <li><strong>Moves 21-50:</strong> Build first row with 128 in corner</li>
        <li><strong>Moves 51-100:</strong> Create 256, then 512—maintain snake pattern</li>
        <li><strong>Moves 100+:</strong> Build to 1024, merge to 2048. Victory!</li>
      </ol>

      <h2>7. Practice Drills</h2>
      <ul>
        <li><strong>Drill 1:</strong> Play 5 games using ONLY down+right (no left, no up)</li>
        <li><strong>Drill 2:</strong> Reach 512 in under 100 moves</li>
        <li><strong>Drill 3:</strong> After losing, replay and beat your previous score</li>
      </ul>

      <h2>8. Frequently Asked Questions</h2>
      
      <h3>Can you always win?</h3>
      <p>No, random tile spawns create variance. Skilled players win 80-90% of games with proper strategy.</p>
      
      <h3>How long to reach 2048?</h3>
      <p>Beginners: 15-30 minutes. Experienced: 5-10 minutes. Your first win might take longer.</p>
      
      <h3>What's the highest tile possible?</h3>
      <p>Theoretically unlimited! Milestones: 2048 (beginner), 4096 (intermediate), 8192 (advanced), 16384 (expert). AI world record: 131072.</p>
      
      <h3>Should I use undo?</h3>
      <p>Yes for learning! It helps understand why moves fail. Reduce usage as you improve to build better instincts.</p>

      <h2>9. Next Steps</h2>
      <ul>
        <li>📚 <a href="/blog/advanced-strategies">Advanced Strategies for 4096+</a></li>
        <li>🎮 <a href="/">Practice on 2048.city</a></li>
        <li>🏆 <a href="/leaderboard">Compete on the Leaderboard</a></li>
        <li>💬 <a href="https://www.reddit.com/r/2048city/" target="_blank" rel="noopener noreferrer">Join r/2048city Community</a></li>
        <li>📱 <a href="/challenges/daily">Try Daily Challenges</a></li>
      </ul>

      <div style={{ marginTop: 48, padding: '1.5rem', background: 'rgba(79, 209, 197, 0.1)', borderLeft: '4px solid #4fd1c5', borderRadius: 8 }}>
        <strong>💡 Pro Tip:</strong> Your first few wins will feel challenging, but once you internalize the corner strategy, reaching 2048 becomes almost automatic. Most players report their "aha moment" around their 10th game. Keep practicing!
      </div>

      <h2>10. More Resources</h2>
      <ul>
        <li><a href="/how-to-play">Interactive How to Play Tutorial</a></li>
        <li><a href="/blog/ai-vs-human">AI vs. Human: Who Plays Better?</a></li>
        <li><a href="/blog/history-of-2048">The History of 2048</a></li>
        <li><a href="/faq">Frequently Asked Questions</a></li>
      </ul>

      <p style={{ marginTop: 40, padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
        <strong>About this guide:</strong> Written by the 2048.city team based on analysis of 10,000+ games and strategies from top players. Updated December 15, 2025. Have suggestions? <a href="/feedback" style={{ color: '#4fd1c5' }}>Send feedback</a> or email <a href="mailto:hello@2048.city" style={{ color: '#4fd1c5' }}>hello@2048.city</a>.
      </p>
    </main>
  );
}
