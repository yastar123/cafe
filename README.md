# ☕ Coffee House — Sistem Pemesanan Kafe

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Express-5-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-c5f74f?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Supabase-Cloud_DB-3ecf8e?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178c6?style=for-the-badge&logo=typescript" />
</p>

**Coffee House** adalah aplikasi web pemesanan kafe berbasis full-stack yang memungkinkan pelanggan melihat menu, melakukan pemesanan, dan upload bukti pembayaran — sementara admin dapat mengelola seluruh operasional kafe melalui panel admin yang lengkap.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Menu & Halaman](#-menu--halaman)
- [Panel Admin](#-panel-admin)
- [Keamanan](#-keamanan)
- [Teknologi](#-teknologi)
- [Struktur Proyek](#-struktur-proyek)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Instalasi & Menjalankan](#-instalasi--menjalankan)
- [Variabel Lingkungan](#-variabel-lingkungan)

---

## 🌟 Fitur Utama

### Untuk Pelanggan
| Fitur | Deskripsi |
|---|---|
| 🏠 **Halaman Beranda** | Landing page dengan hero section dan info kafe |
| 📋 **Menu Interaktif** | Tampilkan menu dengan filter kategori, gambar, harga |
| 🛒 **Keranjang Belanja** | Tambah/kurangi item, kalkulasi total otomatis |
| 💳 **Checkout** | Pilih metode pembayaran, tambahkan catatan pesanan |
| 📸 **Upload Bukti Bayar** | Upload gambar bukti transfer langsung dari halaman checkout |
| 📦 **Riwayat Pesanan** | Lihat semua pesanan beserta status terkini |
| 👤 **Autentikasi** | Register dan login dengan aman |

### Untuk Admin
| Fitur | Deskripsi |
|---|---|
| 📊 **Dashboard** | Statistik real-time: total pendapatan, pesanan, status |
| 🧾 **Manajemen Pesanan** | Lihat, konfirmasi, dan update status semua pesanan |
| ☕ **Manajemen Menu** | Tambah, edit, hapus item menu dengan upload gambar |
| 🏷️ **Manajemen Kategori** | Kelola kategori menu secara dinamis |
| 💳 **Metode Pembayaran** | Tambah/edit/nonaktifkan channel pembayaran |
| 👥 **Manajemen Pengguna** | Lihat semua pengguna, ubah role, hapus akun |
| 📈 **Rekap Keuangan** | Visualisasi pendapatan dengan chart + export Excel |

---

## 🗺️ Menu & Halaman

### Halaman Publik

#### `/` — Beranda
- Hero section dengan nama kafe dan tagline
- Tombol navigasi ke menu dan login

#### `/menu` — Menu Kafe
- Grid menu dengan gambar, nama, deskripsi, harga
- Filter berdasarkan kategori (dinamis dari database)
- Tombol "Tambah ke Keranjang" di setiap item
- Badge ketersediaan (Tersedia / Habis)

#### `/checkout` — Checkout
- Ringkasan item di keranjang
- Pilihan metode pembayaran (dari database)
- Form catatan pesanan opsional
- Upload bukti pembayaran (gambar JPG/PNG/WebP, maks 5 MB)
- Hitung total otomatis

#### `/orders` — Riwayat Pesanan *(Login required)*
- Daftar semua pesanan milik pengguna
- Status pembayaran: `Menunggu` / `Dikonfirmasi` / `Ditolak`
- Status pesanan: `Menunggu` / `Diproses` / `Selesai` / `Dibatalkan`

#### `/order-success` — Konfirmasi Pesanan
- Halaman sukses setelah pesanan berhasil dibuat

### Halaman Autentikasi

#### `/auth/login` — Login
- Form username + password
- Redirect otomatis ke halaman sebelumnya setelah login

#### `/auth/sign-up` — Registrasi
- Form username, email, password
- Validasi input di frontend dan backend

#### `/auth/sign-up-success` — Sukses Registrasi
- Konfirmasi bahwa akun berhasil dibuat

---

## 🛠️ Panel Admin

Semua halaman admin hanya dapat diakses oleh pengguna dengan `role: "admin"`. Akses tanpa autentikasi akan dialihkan ke halaman login.

### `/admin` — Dasbor Utama
- **5 kartu statistik**: Total Pesanan, Total Pendapatan (confirmed), Menunggu Proses, Sedang Dibuat, Pesanan Selesai
- Notifikasi otomatis jika ada pesanan yang menunggu konfirmasi
- Tampilkan tanggal hari ini

### `/admin/orders` — Pesanan Masuk
- Tabel semua pesanan dari semua pelanggan
- Info: nama pelanggan, email, total, metode bayar, status
- Aksi: **Konfirmasi** / **Tolak** pembayaran, update status pesanan
- Preview bukti pembayaran (klik untuk zoom)
- Filter dan sort berdasarkan status

### `/admin/menu` — Daftar Menu
- Tampil menu dikelompokkan per kategori
- Thumbnail gambar setiap item
- Toggle ketersediaan dengan satu klik
- Form tambah/edit: nama, deskripsi, kategori, harga, gambar (upload file atau URL)
- Upload gambar langsung ke server (format JPG, PNG, WebP, maks 5 MB)

### `/admin/categories` — Kategori Menu
- CRUD lengkap untuk kategori
- Validasi: nama unik, tidak boleh kosong
- Kategori digunakan secara dinamis di form menu dan filter halaman menu

### `/admin/payments` — Metode Pembayaran
- Tambah/edit/hapus channel pembayaran (Transfer Bank, QRIS, dll.)
- Isi: nama, nomor rekening, nama pemilik, instruksi, status aktif/nonaktif
- Hanya channel aktif yang muncul di halaman checkout

### `/admin/users` — Pengguna
- Tabel semua pengguna terdaftar
- Ubah role (customer ↔ admin)
- Hapus akun pengguna

### `/admin/rekap` — Rekap Keuangan *(Fitur Terbaru)*
- **Filter periode**: Hari ini, Minggu ini, Bulan ini, Bulan lalu, Tahun ini, atau rentang custom
- **5 kartu ringkasan**: Total Pendapatan, Total Pesanan, Selesai, Rata-rata Pesanan, Menunggu
- **Bar Chart**: Pendapatan harian
- **Line Chart**: Tren pesanan (total vs dikonfirmasi)
- **Pie Chart**: Distribusi status pesanan
- **Progress Bar**: Breakdown per metode pembayaran
- **Tabel Detail**: Semua pesanan dalam periode dengan badge status
- **Export Excel (.xlsx)**: 4 sheet — Ringkasan, Harian, Detail Pesanan, Metode Pembayaran

---

## 🔒 Keamanan

### Autentikasi
- **Session Token**: Saat login berhasil, server menerbitkan token sesi unik yang disimpan di tabel `sessions` di database.
- **Token Storage**: Token disimpan di `sessionStorage` browser (bukan `localStorage`) — otomatis terhapus saat tab/browser ditutup.
- **Bearer Token**: Setiap request ke API terproteksi menyertakan header `Authorization: Bearer <token>`.
- **Token Expiry**: Setiap sesi memiliki waktu kedaluwarsa (`expiresAt`) yang dicek di setiap request.

### Password
- **Bcrypt Hashing**: Password tidak pernah disimpan dalam bentuk plain text. Semua password di-hash menggunakan `bcryptjs` sebelum disimpan ke database.
- **Tidak Ada Plain Text**: Bahkan admin tidak bisa melihat password pengguna.

### Otorisasi Berbasis Role
```
Publik   → Menu, Beranda (tanpa login)
customer → Checkout, Riwayat Pesanan, Upload Bukti Bayar
admin    → Semua halaman admin (Dashboard, Orders, Menu, Categories, Payments, Users, Rekap)
```
- Middleware `requireAuth` memvalidasi token sebelum setiap request terproteksi.
- Middleware `requireAdmin` memastikan role pengguna adalah `admin`.
- Frontend juga memvalidasi role dan redirect jika tidak sesuai.

### Upload File
- Hanya format gambar yang diizinkan: `image/*`
- Ukuran maksimal: **5 MB** per file
- File disimpan di folder `uploads/` di server, bukan di database
- Nama file diacak untuk mencegah konflik dan path traversal

### CORS
- Server menggunakan middleware `cors` untuk mengontrol origin yang diizinkan.

### Validasi Input
- Semua input dari client divalidasi menggunakan **Zod** di backend sebelum diproses.
- Validasi tambahan di frontend untuk UX yang lebih baik.

---

## 🏗️ Teknologi

### Frontend (`artifacts/coffee-house`)
| Teknologi | Versi | Kegunaan |
|---|---|---|
| React | 19 | UI Framework |
| TypeScript | ~5.9 | Type Safety |
| Vite | ^7 | Build Tool & Dev Server |
| TailwindCSS | ^4 | Styling |
| Wouter | ^3.3 | Client-side Routing |
| Recharts | ^2.15 | Chart & Visualisasi |
| Framer Motion | ^12 | Animasi |
| Radix UI | berbagai | Komponen Aksesibel |
| Zustand | ^5 | State Management (Cart) |
| Lucide React | ^0.545 | Icon |
| Sonner | ^2 | Toast Notification |
| XLSX (SheetJS) | latest | Export Excel |
| React Hook Form | ^7 | Form Management |
| Zod | ^3.25 | Schema Validation |

### Backend (`artifacts/api-server`)
| Teknologi | Versi | Kegunaan |
|---|---|---|
| Node.js | ≥18 | Runtime |
| TypeScript | ~5.9 | Type Safety |
| Express | ^5 | Web Framework |
| Drizzle ORM | ^0.45 | Database ORM |
| PostgreSQL (node-postgres) | — | Driver Database |
| Bcryptjs | ^3 | Password Hashing |
| Multer | ^2 | File Upload |
| Pino | ^9 | Logger |
| Zod | ^3.25 | Input Validation |
| Cookie Parser | ^1.4 | Cookie Handling |
| CORS | ^2.8 | Cross-Origin Policy |
| esbuild | 0.27 | Bundler |

### Database & Cloud
| Layanan | Kegunaan |
|---|---|
| **Supabase** | Managed PostgreSQL Cloud |
| **Supabase Pooler** | Connection pooling via PgBouncer (port 6543) |

### Tooling
| Tool | Kegunaan |
|---|---|
| pnpm | Package Manager (Monorepo) |
| pnpm Workspaces | Monorepo Management |
| pnpm Catalog | Centralized Dependency Versioning |

---

## 📁 Struktur Proyek

```
cafe/
├── artifacts/
│   ├── api-server/          # Backend Express API
│   │   ├── src/
│   │   │   ├── app.ts       # Express app setup
│   │   │   ├── index.ts     # Server entry point
│   │   │   ├── lib/
│   │   │   │   ├── auth.ts  # Auth middleware (requireAuth, requireAdmin)
│   │   │   │   └── logger.ts
│   │   │   ├── middlewares/
│   │   │   └── routes/
│   │   │       ├── index.ts      # Router registration
│   │   │       ├── auth.ts       # Login, Register, Logout, Me
│   │   │       ├── menu.ts       # Menu CRUD
│   │   │       ├── categories.ts # Categories CRUD
│   │   │       ├── orders.ts     # Orders CRUD
│   │   │       ├── payments.ts   # Payment Channels CRUD
│   │   │       ├── users.ts      # User management
│   │   │       ├── upload.ts     # File upload
│   │   │       ├── rekap.ts      # Financial recap
│   │   │       └── health.ts     # Health check
│   │   ├── uploads/         # Uploaded images
│   │   ├── .env             # Environment variables
│   │   ├── build.mjs        # esbuild config
│   │   └── package.json
│   │
│   └── coffee-house/        # Frontend React App
│       ├── src/
│       │   ├── App.tsx      # Routing
│       │   ├── main.tsx     # Entry point
│       │   ├── index.css    # Global styles
│       │   ├── components/
│       │   │   ├── AdminSidebar.tsx
│       │   │   ├── MenuGrid.tsx
│       │   │   └── ui/          # Radix UI components
│       │   ├── lib/
│       │   │   ├── api.ts       # API client functions
│       │   │   ├── utils.ts     # Utility functions (formatRupiah, etc.)
│       │   │   └── store/
│       │   │       └── cart.ts  # Zustand cart store
│       │   ├── hooks/
│       │   └── pages/
│       │       ├── HomePage.tsx
│       │       ├── MenuPage.tsx
│       │       ├── CheckoutPage.tsx
│       │       ├── OrdersPage.tsx
│       │       ├── OrderSuccessPage.tsx
│       │       ├── auth/
│       │       │   ├── LoginPage.tsx
│       │       │   ├── SignUpPage.tsx
│       │       │   └── SignUpSuccessPage.tsx
│       │       └── admin/
│       │           ├── AdminDashboard.tsx
│       │           ├── AdminOrdersPage.tsx
│       │           ├── AdminMenuPage.tsx
│       │           ├── AdminCategoriesPage.tsx
│       │           ├── AdminPaymentsPage.tsx
│       │           ├── AdminUsersPage.tsx
│       │           └── AdminRekapPage.tsx
│       └── package.json
│
├── lib/
│   └── db/                  # Shared Database Library
│       ├── src/
│       │   ├── index.ts     # DB connection (Drizzle + pg Pool)
│       │   └── schema/
│       │       └── index.ts # Semua table definitions
│       └── drizzle.config.ts
│
├── package.json             # Root workspace config
├── pnpm-workspace.yaml      # Workspace + catalog definitions
└── README.md
```

---

## 🗄️ Database Schema

Database menggunakan PostgreSQL yang di-host di Supabase.

### Tabel `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `username` | TEXT UNIQUE | Nama pengguna unik |
| `email` | TEXT UNIQUE | Email unik |
| `password_hash` | TEXT | Bcrypt hash password |
| `role` | TEXT | `customer` atau `admin` |
| `created_at` | TIMESTAMP TZ | Waktu dibuat |

### Tabel `sessions`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `user_id` | UUID (FK → users) | Pemilik sesi |
| `token` | TEXT UNIQUE | Token acak unik |
| `expires_at` | TIMESTAMP TZ | Waktu kedaluwarsa |
| `created_at` | TIMESTAMP TZ | Waktu dibuat |

### Tabel `categories`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `name` | TEXT UNIQUE | Nama kategori unik |
| `description` | TEXT | Deskripsi opsional |
| `created_at` | TIMESTAMP TZ | Waktu dibuat |

### Tabel `menu_items`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `name` | TEXT | Nama menu |
| `description` | TEXT | Deskripsi opsional |
| `category` | TEXT | Nama kategori |
| `price` | NUMERIC(12,2) | Harga dalam Rupiah |
| `image_url` | TEXT | URL gambar |
| `available` | BOOLEAN | Stok tersedia |
| `created_at` | TIMESTAMP TZ | Waktu dibuat |

### Tabel `payment_channels`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `name` | TEXT | Nama channel (BCA, QRIS, dll.) |
| `account_number` | TEXT | Nomor rekening / QR ID |
| `account_name` | TEXT | Nama pemilik rekening |
| `instructions` | TEXT | Instruksi transfer |
| `active` | BOOLEAN | Aktif / nonaktif |
| `created_at` | TIMESTAMP TZ | Waktu dibuat |

### Tabel `orders`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `user_id` | UUID (FK → users) | Pelanggan |
| `total_amount` | NUMERIC(12,2) | Total harga |
| `payment_method` | TEXT | Metode pembayaran dipilih |
| `payment_status` | TEXT | `pending` / `confirmed` / `rejected` |
| `order_status` | TEXT | `pending` / `preparing` / `completed` / `cancelled` |
| `payment_proof_url` | TEXT | URL bukti transfer |
| `notes` | TEXT | Catatan pelanggan |
| `created_at` | TIMESTAMP TZ | Waktu dibuat |

### Tabel `order_items`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `order_id` | UUID (FK → orders) | Referensi pesanan |
| `menu_item_id` | UUID (FK → menu_items) | Item yang dipesan |
| `quantity` | INTEGER | Jumlah |
| `unit_price` | NUMERIC(12,2) | Harga satuan saat pesan |
| `subtotal` | NUMERIC(12,2) | quantity × unit_price |
| `created_at` | TIMESTAMP TZ | Waktu dibuat |

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Auth
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/auth/register` | Publik | Daftar akun baru |
| POST | `/auth/login` | Publik | Login, dapat token |
| POST | `/auth/logout` | Login | Hapus sesi |
| GET | `/auth/me` | Login | Info pengguna aktif |

### Menu
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/menu` | Publik | Daftar semua menu tersedia |
| POST | `/menu` | Admin | Tambah menu baru |
| PUT | `/menu/:id` | Admin | Update menu |
| DELETE | `/menu/:id` | Admin | Hapus menu |

### Categories
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/categories` | Publik | Daftar semua kategori |
| POST | `/categories` | Admin | Tambah kategori |
| PUT | `/categories/:id` | Admin | Update kategori |
| DELETE | `/categories/:id` | Admin | Hapus kategori |

### Orders
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/orders` | Login | Pesanan milik user sendiri |
| POST | `/orders` | Login | Buat pesanan baru |
| GET | `/orders/:id/items` | Login | Detail item pesanan |
| GET | `/admin/orders` | Admin | Semua pesanan semua user |
| PATCH | `/admin/orders/:id` | Admin | Update status pesanan |

### Payment Channels
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/payment-channels` | Publik | Channel aktif |
| GET | `/admin/payment-channels` | Admin | Semua channel |
| POST | `/admin/payment-channels` | Admin | Tambah channel |
| PUT | `/admin/payment-channels/:id` | Admin | Update channel |
| DELETE | `/admin/payment-channels/:id` | Admin | Hapus channel |

### Users
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/admin/users` | Admin | Daftar semua user |
| PATCH | `/admin/users/:id/role` | Admin | Ubah role user |
| DELETE | `/admin/users/:id` | Admin | Hapus user |

### Upload
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/upload/menu-image` | Admin | Upload gambar menu |
| POST | `/upload/payment-proof` | Login | Upload bukti bayar |

### Rekap Keuangan
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/admin/rekap?from=YYYY-MM-DD&to=YYYY-MM-DD` | Admin | Data rekap keuangan |

### Health Check
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/healthz` | Publik | Status API server |

---

## 🚀 Instalasi & Menjalankan

### Prasyarat
- **Node.js** ≥ 18
- **pnpm** ≥ 9 (`npm install -g pnpm`)
- Akun **Supabase** dengan database PostgreSQL

### 1. Clone & Install
```bash
git clone <repository-url>
cd cafe
pnpm install
```

### 2. Setup Environment
```bash
# Salin template env
cp .env.example .env
# Edit sesuai konfigurasi Anda
```

### 3. Buat Tabel Database
Jalankan SQL migration atau gunakan Drizzle push:
```bash
pnpm --filter @workspace/db drizzle-kit push
```

### 4. Jalankan API Server
```bash
cd artifacts/api-server
pnpm build
pnpm start
# API berjalan di http://localhost:3001
```

### 5. Jalankan Frontend
```bash
cd artifacts/coffee-house
pnpm dev
# Frontend berjalan di http://localhost:5000
```

### 6. Buat Akun Admin
Daftar akun baru, lalu update role di database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'email-anda@example.com';
```

---

## ⚙️ Variabel Lingkungan

### `artifacts/api-server/.env`
```env
# Port server API
PORT=3001

# Koneksi database Supabase (gunakan pooler untuk performa lebih baik)
DATABASE_URL=postgres://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres

# (Opsional) Supabase untuk fitur Storage / Auth
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

### Format DATABASE_URL Supabase
```
# Transaction Pooler (port 6543) — Direkomendasikan
postgres://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:6543/postgres

# Session Pooler (port 5432)
postgres://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:5432/postgres

# Direct Connection (untuk migration)
postgres://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres
```

---

## 📊 Alur Kerja Sistem

```
Pelanggan                    Backend (API)                  Database
    │                              │                             │
    ├─ Register/Login ────────────►│── Hash password ────────────►
    │◄─ Token ────────────────────┤◄── Save user/session ───────┤
    │                              │                             │
    ├─ Lihat Menu ────────────────►│── Query menu_items ─────────►
    │◄─ Daftar Menu ──────────────┤◄── Return data ─────────────┤
    │                              │                             │
    ├─ Buat Pesanan ──────────────►│── Validasi token ───────────►
    │  + Upload Bukti Bayar        │── Insert order + items ──────►
    │◄─ Order Created ────────────┤◄── Return order ────────────┤
    │                              │                             │
Admin                              │                             │
    ├─ Konfirmasi Pembayaran ─────►│── requireAdmin ─────────────►
    │                              │── Update order status ───────►
    │◄─ Updated Order ────────────┤◄── Return updated ──────────┤
    │                              │                             │
    ├─ Rekap Keuangan ────────────►│── Aggregate orders ─────────►
    │◄─ Charts + Excel ───────────┤◄── Return stats ────────────┤
```

---

## 🎨 Desain & UI

- **Color Palette**: Tema cokelat hangat (`hsl(25, 55%, 18%)`) dengan aksen primary/secondary
- **Typography**: Playfair Display (serif) untuk heading, Inter untuk body
- **Dark/Light Mode**: Didukung via `next-themes`
- **Animasi**: Framer Motion untuk transisi halaman dan micro-interactions
- **Responsive**: Mobile-first design, sidebar kolaps di mobile
- **Toast Notifications**: Sonner untuk feedback aksi (sukses/error)
- **Loading States**: Skeleton loading di semua halaman data

---

## 📝 Catatan Pengembangan

- Proyek menggunakan **pnpm workspaces** (monorepo) — jangan gunakan npm atau yarn
- API server di-bundle menggunakan **esbuild** sebelum dijalankan (`pnpm build`)
- Frontend menggunakan **Vite HMR** — perubahan frontend langsung terlihat tanpa restart
- Setelah mengubah backend, perlu **rebuild** (`pnpm build`) dan **restart server**
- Gambar yang diupload disimpan di `artifacts/api-server/uploads/` — pastikan folder ini ada

---

<p align="center">
  Dibuat dengan ☕ dan 💻 — Coffee House Ordering System
</p>
