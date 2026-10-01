# Project state
Last updated: 2026-10-01

## Works
- A Next.js site is live on Vercel at ai-workshop-flax-eight.vercel.app, deployed from the GitHub repo bivensj-dot/AI-Workshop.
- A Supabase project exists and is linked to the repo.
- Slice 1 is done: sign up, log in, log out, and staying signed in work on the live site. Sign-in talks to Supabase with plain fetch (no Supabase package); the session is stored in the browser.

## Broken or flaky
- Nothing known to be broken.
- No saved data yet: there is no database table and no tasks.

## Environment notes
- Stack: Next.js App Router, TypeScript, plain CSS, Supabase, Vercel.
- Claude Code runs in the browser at claude.ai/code with this repo already selected.
- The Supabase URL and publishable key are set in Vercel. Email confirmation is turned off in Supabase.
- Supabase email sign-up sends a confirmation email by default. The built-in sender has a low hourly limit, and the confirmation link goes to whatever Site URL is set in Supabase Authentication settings. That setting must point to the live Vercel address, not localhost.

## Next session
- Start slice 2: tagged tasks that stay.
- Decide whether to add the @supabase/supabase-js package (recommended for database access); CLAUDE.md requires asking first.
- Every new table needs row level security so each user sees only their own rows.
