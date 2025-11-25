# Store Manager - Sistem Informasi Manajemen Toko

Sistem Informasi Manajemen Toko yang modern dan lengkap untuk pengelolaan inventori, transaksi, dan laporan. Dibangun dengan Next.js 16 (App Router), TypeScript, Prisma, dan MySQL.

## Fitur Utama

### Manajemen Data

- **Manajemen Barang** - CRUD lengkap dengan SKU, kategori, harga, stok, dan unit
- **Manajemen Kategori** - Organisasi barang berdasarkan kategori
- **Manajemen Pengguna** - Sistem user management dengan role-based access

### Operasional

- **Barang Masuk** - Pencatatan transaksi barang masuk dengan referensi
- **Barang Keluar** - Pencatatan transaksi barang keluar
- **Transaksi** - Tracking semua transaksi masuk dan keluar
- **Monitoring Stok** - Real-time stock monitoring dengan peringatan stok minim

### Analitik & Laporan

- **Laporan Harian** - Laporan transaksi harian
- **Laporan Bulanan** - Laporan transaksi bulanan
- **Dashboard Analytics** - Statistik lengkap dengan widget interaktif

### Autentikasi, Profil & Keamanan

- **Login/Register** - Sistem autentikasi dengan username atau email
- **Role-Based Access Control (RBAC)** - Dua level akses: Administrator dan User
- **Protected Routes** - Middleware untuk proteksi route berdasarkan role
- **Session Management** - Cookie-based session dengan auto-sync role
- **Halaman Profil** - Edit nama/email, unggah foto profil, sinkron otomatis dengan session
- **Ganti Password** - Form khusus untuk password lama & baru dengan validasi ketat
- **Pengaturan Sistem** - Preferensi tema & notifikasi (email harian, stok minim, laporan mingguan)

### UI/UX

- **Landing Page** - Halaman depan yang menarik dengan informasi lengkap
- **Responsive Design** - Mobile-friendly dengan Tailwind CSS
- **Dark Mode** - Tema gelap/terang yang dapat di-toggle
- **Dynamic Navigation** - Sidebar menu yang menyesuaikan dengan role user
- **User Profile Menu** - Dropdown menu dengan foto profil di navbar
- **Profil & Keamanan**:
  - Unggah foto profil (preview sebelum simpan)
  - Edit nama & email dengan mode view/edit
  - Ganti password dengan validasi password lama vs baru
  - Feedback sukses/error langsung pada kartu profil & keamanan
- **Pengaturan Sistem**:
  - Toggle ringkasan email harian, peringatan stok minim, dan laporan mingguan
  - Pilihan tema (Ikuti Sistem / Terang / Gelap) dengan radio yang rapi
  - Tombol reset default
- **Halaman Pengaturan** - Kartu preferensi dengan toggle notifikasi & pilihan tema

## Teknologi

### Core Framework

- **Next.js 16** - React framework dengan App Router
- **TypeScript** - Type-safe development
- **React 19** - UI library terbaru

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Custom Components** - Reusable UI components

### Database & ORM

- **MySQL** - Relational database
- **Prisma** - Next-generation ORM
- **Prisma Studio** - Database GUI

### Form & Validation

- **React Hook Form** - Performant form library
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Zod resolver untuk React Hook Form

### Authentication

- **bcryptjs** - Password hashing
- **Custom Session** - Cookie-based session management

## Struktur Proyek

```
Sistem-Informasi-Manajemen-Toko/
├── app/
│   ├── (auth)/              # Route group untuk autentikasi
│   │   ├── layout.tsx       # Layout split-screen untuk auth pages
│   │   ├── login/           # Halaman login
│   │   ├── register/        # Halaman registrasi
│   │   └── reset-password/  # Halaman reset password
│   ├── dashboard/           # Halaman dashboard (protected)
│   │   ├── layout.tsx      # Dashboard layout dengan sidebar & header
│   │   ├── page.tsx        # Dashboard utama dengan widgets
│   │   ├── products/       # Manajemen Barang
│   │   ├── categories/     # Manajemen Kategori (Admin only)
│   │   ├── incoming/       # Barang Masuk (Admin only)
│   │   ├── outgoing/       # Barang Keluar (Admin only)
│   │   ├── transactions/   # Daftar Transaksi
│   │   ├── stock/          # Monitoring Stok
│   │   ├── reports/        # Laporan harian & bulanan (Admin only)
│   │   ├── profile/        # Halaman profil & avatar
│   │   ├── change-password/# Halaman ganti password
│   │   ├── settings/       # Halaman pengaturan preferensi
│   │   └── users/          # Manajemen Pengguna (Admin only)
│   ├── api/                # API Routes
│   │   ├── search/         # Global search endpoint
│   │   ├── admin/           # Admin-only API routes
│   │   └── ...
│   ├── logout/             # Logout route handler
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Base UI components (Button, Card, Input, dll)
│   ├── layouts/            # Layout components
│   │   ├── sidebar.tsx     # Sidebar navigation dengan role-based menu
│   │   └── user-menu.tsx   # User profile dropdown menu
│   ├── dashboard/          # Dashboard-specific components
│   └── auth/               # Auth-specific components
├── lib/
│   ├── auth/               # Authentication utilities
│   │   └── auth.ts         # Session management, password hashing
│   ├── db/                 # Database operations
│   │   ├── connection.ts   # Prisma client instance
│   │   ├── users.ts        # User queries
│   │   ├── products.ts     # Product queries
│   │   ├── categories.ts   # Category queries
│   │   ├── transactions.ts # Transaction queries
│   │   ├── reports.ts      # Report queries
│   │   └── dashboard-stats.ts # Dashboard statistics
│   ├── config/             # Configuration files
│   │   └── navigation.ts  # Sidebar navigation configuration
│   ├── middleware/         # Middleware utilities
│   │   └── role-guard.ts  # Role-based access control
│   ├── utils/              # Utility functions
│   └── validations/        # Zod schemas
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seed script
├── public/                  # Static assets
│   └── store.png           # Logo aplikasi
├── types/                   # TypeScript type definitions
├── middleware.ts            # Next.js middleware untuk route protection
├── .env                     # Environment variables
├── package.json
└── README.md
```

## Setup & Instalasi

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm atau yarn

### 1. Clone Repository

```bash
git clone <repository-url>
cd Sistem-Informasi-Manajemen-Toko
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

1. Buat database MySQL dengan nama `StoreManager` (atau sesuai kebutuhan)
2. Copy file `.env.example` menjadi `.env` (atau buat file `.env` baru)
3. Update `DATABASE_URL` di file `.env`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/StoreManager?schema=public"
```

**Contoh untuk Laragon/XAMPP:**

```env
DATABASE_URL="mysql://root:@localhost:3306/StoreManager"
```

### 4. Setup Prisma

```bash
# Generate Prisma Client
npm run db:generate

# Push schema ke database (untuk development)
npm run db:push

# Seed database dengan data awal
npm run db:seed
```

> **Catatan**: Versi terbaru menambahkan kolom `avatarUrl` pada tabel `users`. Pastikan menjalankan `npm run db:push` (atau migrasi produksi) setelah menarik perubahan ini agar struktur database sinkron.

### 5. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## Default Accounts

Setelah menjalankan seed script, Anda dapat login dengan akun berikut:

### Administrator

- **Email/Username**: `admin@storemanager.com`
- **Password**: `admin123`
- **Role**: Administrator (akses penuh)

### User

- **Email/Username**: `user@storemanager.com`
- **Password**: `user123`
- **Role**: User (akses terbatas)

## Role-Based Access Control

### Administrator

Memiliki akses penuh ke semua fitur:

- Dashboard
- Manajemen Barang
- Manajemen Kategori
- Barang Masuk
- Barang Keluar
- Transaksi
- Monitoring Stok
- Laporan
- Manajemen Pengguna

### User

Memiliki akses terbatas:

- Dashboard
- Manajemen Barang (view & edit)
- Transaksi (view)
- Monitoring Stok (view)

## Scripts

| Command               | Description                           |
| --------------------- | ------------------------------------- |
| `npm run dev`         | Jalankan development server           |
| `npm run build`       | Build untuk production                |
| `npm run start`       | Jalankan production server            |
| `npm run lint`        | Lint code dengan ESLint               |
| `npm run db:generate` | Generate Prisma Client                |
| `npm run db:push`     | Push schema ke database (development) |
| `npm run db:migrate`  | Run migrations (production)           |
| `npm run db:studio`   | Buka Prisma Studio (database GUI)     |
| `npm run db:seed`     | Seed database dengan data awal        |

## Database Schema

### Models

#### User

- `id` - Primary key
- `name` - Nama pengguna (username)
- `email` - Email (unique)
- `password` - Password (hashed)
- `role` - Role (administrator | user)
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

#### Category

- `id` - Primary key
- `name` - Nama kategori
- `description` - Deskripsi kategori
- `products` - Relasi ke Product
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

#### Product

- `id` - Primary key
- `name` - Nama produk
- `sku` - Kode barang (unique)
- `description` - Deskripsi produk
- `categoryId` - Foreign key ke Category
- `price` - Harga (Decimal)
- `stock` - Stok saat ini
- `minStock` - Stok minimal
- `unit` - Unit (pcs, box, pack, dll)
- `transactionItems` - Relasi ke TransactionItem
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

#### Transaction

- `id` - Primary key
- `type` - Tipe transaksi (MASUK | KELUAR)
- `reference` - Referensi (No. faktur, surat jalan, dll)
- `notes` - Catatan
- `totalAmount` - Total jumlah (Decimal)
- `items` - Relasi ke TransactionItem
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

#### TransactionItem

- `id` - Primary key
- `transactionId` - Foreign key ke Transaction
- `productId` - Foreign key ke Product
- `quantity` - Jumlah
- `price` - Harga per unit
- `subtotal` - Subtotal
- `createdAt` - Timestamp

## Arsitektur

Proyek ini menggunakan **Hybrid MVC Pattern** dengan Next.js App Router:

- **Model**: `lib/db/` - Database queries dan Prisma models
- **View**: `app/**/page.tsx` + `components/` - UI components (Server & Client Components)
- **Controller**: `app/api/**/route.ts` + Server Actions - Business logic

### Server Components vs Client Components

- **Server Components**: Default di Next.js App Router, untuk data fetching dan rendering di server
- **Client Components**: Menggunakan `"use client"` directive, untuk interaktivitas dan state management

### Authentication Flow

1. User login → `loginAction` (Server Action)
2. Verify password → `verifyPassword`
3. Create session → `createSession` (set cookie)
4. Middleware check → `middleware.ts` (protect routes)
5. Get session → `getSession` (read cookie, sync with DB)

### Role-Based Access Control

1. **Database Level**: Role stored in `User` model
2. **Session Level**: Role synced in session cookie
3. **Middleware Level**: Route protection based on role
4. **Component Level**: UI filtering based on role
5. **API Level**: Server Actions protected with `requireAdministrator()`

## Fitur UI/UX

### Landing Page

- Hero section dengan CTA
- Features showcase
- Technology stack
- About section
- Contact information
- Footer dengan social media links
- **Dynamic Navbar**: Menampilkan foto profil dan menu Dashboard jika user sudah login

### Dashboard

- **Sticky Header**: Header yang tetap terlihat saat scroll
- **Sidebar Navigation**: Menu yang disesuaikan dengan role user
- **Widget Dashboard**:
  - Statistik cards (Total Barang, Pendapatan, Stok Minim, Barang Habis)
  - Financial Overview (Transaksi Masuk, Transaksi Keluar, Laba Bulan Ini)
  - Stok yang Perlu Perhatian
  - Barang Habis
  - Transaksi Terbaru
  - Top 5 Produk Terlaris
  - Ringkasan Bulan Ini

### Authentication Pages

- Split-screen layout
- Left panel: Branding dengan logo dan informasi
- Right panel: Form (login/register/reset password)
- Password visibility toggle
- Form validation dengan error messages

## Keamanan

- Password hashing dengan bcryptjs (10 rounds)
- HTTP-only cookies untuk session
- CSRF protection dengan SameSite cookie
- Role-based route protection
- Server-side validation dengan Zod
- SQL injection protection dengan Prisma

## Dependencies

### Production

- `next` - Next.js framework
- `react` & `react-dom` - React library
- `@prisma/client` - Prisma ORM client
- `bcryptjs` - Password hashing
- `zod` - Schema validation
- `react-hook-form` - Form management
- `@hookform/resolvers` - Form resolvers
- `lucide-react` - Icon library
- `tailwindcss` - CSS framework
- `@radix-ui/*` - UI component primitives

### Development

- `typescript` - TypeScript compiler
- `prisma` - Prisma CLI
- `eslint` - Linter
- `tsx` - TypeScript execution

## Troubleshooting

### Database Connection Error

- Pastikan MySQL server berjalan
- Cek `DATABASE_URL` di file `.env`
- Pastikan database sudah dibuat

### Prisma Client Error

```bash
npm run db:generate
```

### Session Not Working

- Pastikan cookies diaktifkan di browser
- Cek `NODE_ENV` di `.env`
- Clear browser cookies dan coba lagi

### Role Not Showing Correctly

- Pastikan role di database adalah `"administrator"` atau `"user"` (lowercase)
- Logout dan login ulang
- Cek console log untuk debugging

## Lisensi

Proyek ini dibuat untuk keperluan akademik (Tugas Mata Kuliah Proyek Perangkat Lunak).

## Kontributor

Dikembangkan dengan menggunakan Next.js dan teknologi modern lainnya.

---

**Store Manager** - Solusi manajemen toko modern dan terpercaya.
