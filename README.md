# TEIN-KUC & NDC Portal

Official website for TEIN-KUC (Tertiary Education Institutions Network,
Koforidua University College chapter) in partnership with the NDC. The
site provides student information (Student Loan Trust Fund guidance, Ghana
Card support, academic support) and a member portal for registration,
online elections, and submitting queries/suggestions/requests to leadership.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4
- Prisma ORM + PostgreSQL
- Auth.js (NextAuth v5) with credentials (Student ID + password) login

## Getting Started

You need a PostgreSQL database — a local instance, or a free hosted one
(e.g. [Neon](https://neon.tech) or [Supabase](https://supabase.com)).

```bash
npm install
cp .env.example .env        # set DATABASE_URL and AUTH_SECRET (openssl rand -base64 32)
npx prisma migrate deploy   # applies the schema to your database
npm run db:seed             # creates an admin account + a sample election
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The seed script creates an admin login:

- Student ID: `ADMIN-0001`
- Password: `ChangeMe123!`

Override these via `SEED_ADMIN_STUDENT_ID` / `SEED_ADMIN_PASSWORD` env vars
before seeding, and change the password after first login in production.

## Deploying to Vercel

1. Create a Postgres database (Vercel Postgres, Neon, or Supabase all work)
   and copy its connection string.
2. Import this repository into Vercel and set two environment variables:
   `DATABASE_URL` (the connection string) and `AUTH_SECRET` (`openssl rand
   -base64 32`).
3. After the first deploy, run once against that database:
   `DATABASE_URL="..." npx prisma migrate deploy` and
   `DATABASE_URL="..." npm run db:seed`.

## Site Structure

- **Home** — overview and latest highlights
- **About Us** — chapter history, executive team, President's profile
- **Ideology** — NDC history, governance philosophy, manifesto
- **Membership** — registration and member login
- **Resources** — SLTF loan guide, Ghana Card guide, academic support
- **Contact** — leadership contact details
- **Dashboard** (members) — view/edit profile, vote in open elections,
  submit and track queries/suggestions/requests
- **Admin Panel** (`ADMIN`/`EXECUTIVE` roles) — create and open/close
  elections, add positions and candidates, respond to member submissions

## Notes

- Roles (`MEMBER`, `EXECUTIVE`, `ADMIN`) and other enum-like fields are
  plain strings in the schema for portability; allowed values live in
  `src/lib/constants.ts`.
- Votes are unique per member per position (`@@unique([userId, positionId])`
  on `Vote`), enforced both at the database level and in the `/api/vote`
  route.
