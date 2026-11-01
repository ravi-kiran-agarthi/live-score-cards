# live-score-cards

Single-page live scores: NFL, NBA, WNBA, MLB, Soccer (Premier League, La Liga, Bundesliga, Serie A, Ligue 1). Auto-updating, light/dark/system theme.

Site: https://ravi-kiran-agarthi.github.io/live-score-cards/
Data: ESPN public scoreboard API.


## Bracket
Opt-in, lazy-loaded playoff bracket: `#nfl/bracket`, `#nba/bracket`, `#wnba/bracket`, `#mlb/bracket`. Shows projected seeds until playoffs start.

## Updates

Each deploy stamps the commit SHA into `index.html` and `version.json`. The page checks it every 5 min and on tab focus, and shows "New version available" when it differs. No manual version bump needed.
