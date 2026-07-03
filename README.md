# TEIN-KUC & NDC Portal

Official website for TEIN-KUC (Tertiary Education Institutions Network,
Koforidua University College chapter) in partnership with the NDC. The
site provides student information (Student Loan Trust Fund guidance, Ghana
Card support, academic support) and a member portal for registration,
online elections, and submitting queries/suggestions/requests to leadership.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4
- Prisma ORM + SQLite (swap the `DATABASE_URL` in `.env` for Postgres/MySQL in production)
- Auth.js (NextAuth v5) with credentials (Student ID + password) login

## Getting Started

```bash
npm install
cp .env.example .env        # set AUTH_SECRET (openssl rand -base64 32)
npx prisma migrate dev      # creates the SQLite database
npm run db:seed             # creates an admin account + a sample election
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The seed script creates an admin login:

- Student ID: `ADMIN-0001`
- Password: `ChangeMe123!`

Override these via `SEED_ADMIN_STUDENT_ID` / `SEED_ADMIN_PASSWORD` env vars
before seeding, and change the password after first login in production.

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
  plain strings in the schema because SQLite has no native enum type;
  allowed values live in `src/lib/constants.ts`.
- Votes are unique per member per position (`@@unique([userId, positionId])`
  on `Vote`), enforced both at the database level and in the `/api/vote`
  route.
