# Store Manager - Sistem Informasi Manajemen Toko

Sistem Informasi Manajemen untuk pengelolaan toko yang dikembangkan menggunakan Next.js dan MySQL.

## Fitur

- ✅ Manajemen Barang (CRUD)
- ✅ Manajemen Kategori
- ✅ Transaksi Masuk dan Keluar
- ✅ Perhitungan Stok Otomatis
- ✅ Monitoring Stok (dengan peringatan stok minim)
- ✅ Laporan Harian
- ✅ Laporan Bulanan

## Teknologi

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + Custom Components
- **Database**: MySQL
- **ORM**: Prisma
- **Form Handling**: React Hook Form + Zod

## Struktur Proyek

```
app/
├── auth/                # Halaman autentikasi
│   ├── layout.tsx       # Layout untuk halaman auth (centered)
│   ├── login/           # Halaman login
│   └── register/        # Halaman register
├── dashboard/           # Halaman dashboard (protected)
│   ├── layout.tsx       # Dashboard layout dengan sidebar
│   ├── page.tsx         # Dashboard utama
│   ├── products/        # Manajemen Barang
│   ├── categories/      # Manajemen Kategori
│   ├── transactions/    # Transaksi Masuk/Keluar
│   ├── stock/           # Monitoring Stok
│   └── reports/         # Laporan
├── api/                 # API Routes (Backend)
├── components/          # Reusable Components
│   ├── ui/             # Base UI components
│   └── layouts/         # Layout components
├── lib/                 # Utilities & Config
│   ├── db/             # Database connection & queries
│   └── utils/          # Helper functions
└── types/              # TypeScript types/interfaces
```

## Setup & Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd Sistem-Informasi-Manajemen-Toko-Alat-Tulis
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

1. Buat database MySQL dengan nama `sim_atk` (atau sesuai kebutuhan)
2. Copy file `.env.example` menjadi `.env`
3. Update `DATABASE_URL` di file `.env`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/sim_atk?schema=public"
```

### 4. Setup Prisma

```bash
# Generate Prisma Client
npm run db:generate

# Push schema ke database (untuk development)
npm run db:push

# Atau gunakan migration (untuk production)
npm run db:migrate
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - Jalankan development server
- `npm run build` - Build untuk production
- `npm run start` - Jalankan production server
- `npm run lint` - Lint code
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema ke database (development)
- `npm run db:migrate` - Run migrations (production)
- `npm run db:studio` - Buka Prisma Studio

## Arsitektur

Proyek ini menggunakan **Hybrid MVC Pattern** dengan Next.js App Router:

- **Model**: `lib/db/` - Database queries dan Prisma models
- **View**: `app/**/page.tsx` + `components/` - UI components
- **Controller**: `app/api/**/route.ts` + logic di `lib/` - Business logic

## Database Schema

### Tables

- `categories` - Kategori barang
- `products` - Data barang/produk
- `transactions` - Transaksi masuk/keluar
- `transaction_items` - Item dalam transaksi

## Pengembangan

### Menambah Fitur Baru

1. Buat schema di `prisma/schema.prisma` jika perlu
2. Generate Prisma Client: `npm run db:generate`
3. Buat query functions di `lib/db/`
4. Buat API routes di `app/api/`
5. Buat UI components di `app/dashboard/`

## Lisensi

Proyek ini dibuat untuk keperluan akademik (Tugas Mata Kuliah Proyek Perangkat Lunak).
