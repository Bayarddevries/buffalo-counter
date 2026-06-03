# Deploy contract: buffalo-counter

## Live site
https://bayarddevries.github.io/buffalo-counter/

## How it deploys
- Branch: `master`
- CI: GitHub Actions auto-deploys to GitHub Pages on push.
- No build step; serves `index.html`, `styles.css`, `app.js`.

## Local preview
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Rollback
```bash
git revert HEAD
git push origin master
```
