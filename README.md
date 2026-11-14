# gg math

A starter project for a student-resource homepage and a password-protected interactive-activities page.

## Run it on Linux Mint

1. Install Node.js 20 or newer if it is not already installed.
2. Open this folder in VS Code.
3. Open the VS Code terminal.
4. Run:

   ```bash
   npm install
   cp .env.example .env
   ```

5. Edit `.env` and set:
   - `PORTAL_PASSWORD` to a long, unique shared password.
   - `SESSION_SECRET` to a different long, random secret.
6. Start the site:

   ```bash
   npm start
   ```

7. Open `http://localhost:3000` in Firefox or Chrome.

## Routes

- `/` — public gg math homepage
- `/login` — shared-password login
- `/games` — protected activities page
- `POST /logout` — ends the session

## Important before publishing

This starter is suitable for local development. Before putting it on the public internet:

- Deploy behind HTTPS.
- Replace Express's default in-memory session store with a persistent production session store supported by your host.
- Keep `.env` private; never commit it or put passwords in browser JavaScript.
- Use a long, unique password and rotate it if it is shared too widely.
- Check your host's current deployment instructions and security settings.
- Only embed games whose publishers permit iframe embedding. Some sites deliberately block it.
- Make sure the site is used in accordance with the network and device rules that apply where it is accessed.

The site uses its own gg math branding and is not affiliated with PowerSchool or any school.
