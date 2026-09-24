# CLAUDE.md

## Stack
- Next.js with the App Router, TypeScript
- Plain CSS only: no Tailwind, no CSS-in-JS, no UI component libraries
- Supabase for sign-in and the database
- Deployed on Vercel from the main branch of bivensj-dot/AI-Workshop

## Commands
- `npm run dev` starts the site locally
- `npm run build` builds the site the way Vercel does; run it before calling any change done

## Never
- Add a dependency without asking first and saying why it is needed
- Edit .env, .env.local, or any environment variable, locally or in Vercel
- Change auth configuration without first saying what is changing and why
- Create new top-level folders
- Put passwords, API keys, or connection strings in code, commits, or chat
- Use real personal data; fake names and fake content only
- Commit, open a pull request, or merge unless that session's prompt says to

## Conventions
- Work in small changes that each fit inside one slice from roadmap.md
- Every Supabase table has row level security turned on, so each user can only read and write their own rows
- The six skills are fixed: Speaking, Listening, Reading, Writing, Vocabulary, Grammar
- After any change, explain in plain language what changed and why, list the files touched, and stop so the owner can review
- When a slice's done-criteria all pass on the live site, update roadmap.md and project-state.md in the same change

## Current focus
See roadmap.md. Work only on the slice marked ACTIVE.
