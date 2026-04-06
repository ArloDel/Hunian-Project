# Hunian Mahmudah

Hunian Mahmudah adalah web app pemesanan kost dan kontrakan berbasis `Next.js` yang sudah dilengkapi frontend modern, backend API route handlers, autentikasi `Better Auth`, dan ORM `Drizzle` dengan `MySQL`.

## Stack

- `Next.js 16` App Router
- `React 19`
- `Tailwind CSS 4`
- `shadcn-style reusable UI components`
- `Better Auth`
- `Drizzle ORM`
- `MySQL`

## Fitur Yang Sudah Ada

- Landing page katalog hunian
- Halaman login dan register
- Session-aware header
- Form booking yang terhubung ke backend
- Riwayat booking user
- Dashboard owner dengan data live
- API untuk auth, units, bookings, health check, dan owner dashboard
- Seed data demo untuk owner, tenant, unit, dan booking

## Struktur Penting

- `src/app` : routing halaman dan API route handlers
- `src/components` : komponen UI dan komponen halaman
- `src/db` : schema Drizzle, koneksi database, dan seed
- `src/lib` : auth, helper API, env parser, validator
- `drizzle.config.ts` : konfigurasi Drizzle Kit

## Persiapan Local Development

1. Pastikan MySQL lokal aktif.
2. File `.env` sudah tersedia di root project.
3. Sesuaikan nilai berikut bila perlu:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=hunian_mahmudah

BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Install Dan Jalankan

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

App akan berjalan di:

[http://localhost:3000](http://localhost:3000)

## Akun Demo

- Owner:
  - Email: `owner@hunian.test`
  - Password: `Owner12345!`
- Tenant:
  - Email: `tenant@hunian.test`
  - Password: `Tenant12345!`

## Script Yang Tersedia

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:generate
npm run db:push
npm run db:studio
npm run db:seed
```

## Database Tools

Untuk melihat database dengan Drizzle Studio:

```bash
npm run db:studio
```

Lalu buka:

[https://local.drizzle.studio](https://local.drizzle.studio)

## Endpoint API Utama

- `GET /api/health`
- `GET /api/me`
- `GET /api/auth/session`
- `GET/POST /api/units`
- `GET/PATCH/DELETE /api/units/:unitId`
- `GET/POST /api/bookings`
- `GET/PATCH /api/bookings/:bookingId`
- `GET /api/owner/dashboard`

## Catatan

- File `.env` tidak di-commit ke repository.
- Untuk login dan booking, backend harus sudah terhubung ke MySQL.
- Jika ingin deploy, sesuaikan `BETTER_AUTH_URL` dan `NEXT_PUBLIC_APP_URL` dengan domain production.
