# SalonSync

**Booking that fills your chairs — and stops the no-shows.** SalonSync runs your
salon’s calendar, takes a deposit when clients book, and texts every client a
reminder — so the chair is never empty and the till is never short.

## Quick start

```bash
npm install
npm run dev          # → http://localhost:3000  (demo mode, no keys needed)
```

## Make it yours

Open this folder in **Claude Code** and say **"set up this project"** (or run
**`/setup`**). It asks for your brand, logo, colors, and your **Stripe** +
**Twilio** keys, then wires them in. By hand? See [`SETUP.md`](./SETUP.md).

## What it needs (all optional — demo mode works with none)

| Integration | Powers |
|---|---|
| **Stripe** (`STRIPE_SECRET_KEY`) | Deposits, no-show fees & payments |
| **Twilio** (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`) | SMS appointment reminders |
| **Supabase** | Stores clients, appointments & services |

## Pages

`Calendar` (today’s schedule) · `Clients` (history & notes) · `Services` (menu +
new-booking builder) · `Payments` (deposits & no-show fees) · `Settings`.

Built on the GoatStarter template — Next.js 16 · React 19 · Tailwind v4.
