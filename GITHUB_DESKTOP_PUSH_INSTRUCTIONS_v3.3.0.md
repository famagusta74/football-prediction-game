# GitHub Desktop Push Instructions — v3.3.0

## What Changed
Version **v3.3.0** adds 8 Round of 16 matches (ids 89–96) for the FIFA World Cup 2026 knockout stage, covering 04–07 July 2026. All times are in EEST (Cyprus/Greece, UTC+3).

---

## Files Modified
- `app.js` — version bumped to v3.3.0; 8 new Round of 16 match entries added
- `index.html` — version labels updated to v3.3.0 (5 places)
- `README.md` — version updated
- `docs/index.html` — version badge updated
- `docs/APPLICATION_DEFINITION.md` — version updated
- `docs/TECHNICAL_SPECIFICATION.md` — version updated
- `docs/SOURCE_CODE_DOCUMENTATION.md` — version updated + v3.3.0 feature section added
- `RELEASE_NOTES_v3.3.0.md` — new file
- `GITHUB_DESKTOP_PUSH_INSTRUCTIONS_v3.3.0.md` — new file (this file)

---

## Steps

### 1. Open GitHub Desktop
Launch the **GitHub Desktop** app on your Mac.

### 2. Confirm Changed Files
You should see all the files listed above in the **Changes** panel on the left.

### 3. Enter Commit Message
In the **Summary** field at the bottom left, paste:
```
v3.3.0 — Round of 16 matches added (04–07 Jul 2026, ids 89–96)
```

### 4. Commit
Click the blue **Commit to main** button.

### 5. Push
Click **Push origin** in the top toolbar.

---

## After Push
- GitHub Pages will rebuild automatically (usually within 1–2 minutes)
- All users will receive the 8 new Round of 16 matches on their **next page load** — no manual action required
- The version-based Firebase merge will add only the new matches without affecting any existing predictions or results
