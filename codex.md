# 2048.city Product Notes

## Direction

2048.city should become a focused home for people who seriously enjoy 2048: a clean board, fair competition, repeatable daily puzzles, and useful post-game feedback.

The first product promise is:

> A 2048 practice and challenge site where every serious run is measurable, replayable in spirit, and worth sharing.

## First-Stage Scope

- Preserve a fast, readable classic 2048 board as the first screen.
- Add explicit play modes:
  - Classic: pure competitive runs, no undo, eligible for the global leaderboard.
  - Practice: undo-enabled local training, not submitted to the leaderboard.
  - Daily: same deterministic seed for everyone each UTC day, no undo, prepared for daily competition.
- Track meaningful run stats: moves, elapsed time, max tile, undo usage, seed, and final board.
- Persist an active run locally so a player can leave and resume.
- Show a compact post-game analysis with practical feedback, not generic encouragement.
- Make board sharing easy with a text summary that includes score, max tile, moves, mode, and board state.
- Keep SEO/content pages secondary until the game itself feels worth returning to.

## Implementation Notes From This Pass

- The existing project already has the game, auth, leaderboard APIs, feedback, and content pages.
- The old game implementation is DOM-driven inside React. The first pass keeps that shape to avoid a risky rewrite, but adds stats, mode, persistence, and callbacks around it.
- Score submission should only happen for Classic runs in this stage. Practice and Daily need separate rule sets before being mixed into competitive rankings.
- `package-lock.json` was already deleted before this pass and is intentionally left untouched.

## Next Bigger Refactor

- Extract the 2048 reducer/state model from DOM rendering.
- Add deterministic replay logs for leaderboard verification.
- Add dedicated database columns for mode, seed, undo usage, duration, moves, and final board.
- Build a real Daily Challenge leaderboard keyed by date and seed.
- Replace generic strategy articles with interactive board examples and post-game review tools.
