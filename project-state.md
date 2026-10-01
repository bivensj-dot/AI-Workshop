# Project state
Last updated: 2026-10-01

## Works
- Sign up, log in, log out and session restore (slice 1, done).
- Tagged tasks that save per user and can be ticked done (slice 2, built; awaiting your check on the preview link).
- A Next.js site is live on Vercel at ai-workshop-flax-eight.vercel.app, deployed from the GitHub repo bivensj-dot/AI-Workshop.
- A Supabase project exists and is linked to the repo.

## Broken or flaky
- Nothing known to be broken.
- Slice 2 needs the `tasks` table created in the Supabase SQL Editor (SQL is in the Slice 2 pull request reply). Until then, the task list shows an error.

## Environment notes
- Stack: Next.js App Router, TypeScript, plain CSS, Supabase, Vercel.
- Claude Code runs in the browser at claude.ai/code with this repo already selected.
- Unknown: whether the Supabase URL and publishable key are already set as environment variables in Vercel and in a local .env.local file. Check this before starting slice 1.
- Supabase email sign-up sends a confirmation email by default. The built-in sender has a low hourly limit, and the confirmation link goes to whatever Site URL is set in Supabase Authentication settings. That setting must point to the live Vercel address, not localhost.

## Next session
- Run the slice 2 SQL, check the done-criteria on the preview link, then merge.
- Start slice 3: skill summary.
