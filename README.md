# GTA VI Tracker — Leonida Progress

Track your GTA VI mission and chapter progress. Public website with per-user saves via Discord login.

## Stack
- **Next.js 14** (App Router)
- **Supabase** (Postgres + Auth + RLS)
- **Tailwind CSS** (Vice City palette)
- **Vercel** (deploy)

## Local Setup

```bash
npm install
cp .env.local.example .env.local
# fill in your Supabase keys (see below)
npm run dev
```

## Supabase Setup

See `supabase-schema.sql` — run it once in the Supabase SQL editor.

## Vercel Deploy

```bash
vercel --prod
# add env vars in Vercel dashboard
```
