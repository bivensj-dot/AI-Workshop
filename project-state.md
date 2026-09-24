# Project state
Last updated: 2026-09-23

## Works
- A Next.js site is live on Vercel at ai-workshop-flax-eight.vercel.app, deployed from the GitHub repo bivensj-dot/AI-Workshop.
- A Supabase project exists and is linked to the repo.

## Broken or flaky
- Nothing known to be broken.
- The site does not use Supabase yet. There is no sign-in and no saved data.

## Environment notes
- Stack: Next.js App Router, TypeScript, plain CSS, Supabase, Vercel.
- Claude Code runs in the browser at claude.ai/code with this repo already selected.
- Unknown: whether the Supabase URL and publishable key are already set as environment variables in Vercel and in a local .env.local file. Check this before starting slice 1.
- Supabase email sign-up sends a confirmation email by default. The built-in sender has a low hourly limit, and the confirmation link goes to whatever Site URL is set in Supabase Authentication settings. That setting must point to the live Vercel address, not localhost.

## Next session
- Start slice 1: sign up and log in.
- Confirm the Supabase environment variables exist in Vercel.
- Decide whether to keep email confirmation on or turn it off for the workshop.
- Set the Supabase Site URL to the live Vercel address.
