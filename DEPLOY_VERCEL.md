# 🚀 Panduan Deployment ke Vercel

Aplikasi **Coffee House** terdiri dari dua bagian (Backend API dan Frontend React) yang berada dalam satu repositori (*monorepo*). Vercel sangat mendukung struktur ini. Anda akan mendeploy **2 project terpisah** di Vercel dari 1 repository GitHub yang sama.

Ikuti panduan langkah demi langkah di bawah ini.

---

## 🛠️ Bagian 1: Deploy Backend (API Server)

Pertama, kita akan mengonlinekan server API Express agar database dan endpoint siap digunakan.

1. Buka dashboard [Vercel](https://vercel.com/dashboard) dan klik tombol **Add New...** > **Project**.
2. Hubungkan akun GitHub Anda dan pilih repository `yastar123/cafe` (atau nama repo Anda).
3. Klik **Import**.
4. Pada halaman konfigurasi **Configure Project**, isi persis seperti panduan berikut:

### Konfigurasi Vercel (Backend)
- **Project Name:** `cafe-api-server` (atau sesuai keinginan)
- **Framework Preset:** Pilih `Express` (atau `Other` / `Node.js`)
- **Root Directory:** Edit dan pilih folder `artifacts/api-server`
- **Build Command:** Biarkan kosong / `None` (override jika perlu)
- **Output Directory:** `N/A`
- **Install Command:** Biarkan default (`pnpm install` otomatis terdeteksi)

### 🔐 Environment Variables (PENTING!)
Buka bagian **Environment Variables** dan masukkan key dari `.env` lokal Anda:
- Key: `DATABASE_URL`
- Value: `postgres://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
*(Ganti value di atas dengan URL dari Supabase Anda)*

5. Klik tombol **Deploy**. Tunggu hingga proses build selesai.
6. Catat **URL Vercel Backend** Anda (contoh: `https://cafe-api-server.vercel.app`). URL ini akan kita gunakan untuk Frontend.

---

## 🎨 Bagian 2: Deploy Frontend (Coffee House)

Setelah Backend online, sekarang kita deploy tampilan websitenya.

1. Kembali ke dashboard Vercel, klik lagi **Add New...** > **Project**.
2. Pilih repository GitHub yang sama (`yastar123/cafe`) lalu klik **Import**.
3. Konfigurasikan project kedua ini untuk Frontend:

### Konfigurasi Vercel (Frontend)
- **Project Name:** `coffee-house-web` (atau sesuai keinginan)
- **Framework Preset:** `Vite`
- **Root Directory:** Edit dan pilih folder `artifacts/coffee-house`
- **Build Command:** `pnpm run build`
- **Output Directory:** `dist`

### 🔗 Penghubung ke Backend (Environment Variables)
Kita harus memberitahu Frontend di mana letak API Server yang baru saja kita deploy. Masukkan ke bagian **Environment Variables**:
- Key: `VITE_API_URL` (atau variabel base API jika digunakan)
- Value: `https://cafe-api-server.vercel.app/api` *(Ganti dengan URL Backend Vercel Anda di Bagian 1, pastikan diakhiri dengan `/api`)*

4. Klik **Deploy** dan tunggu proses selesai.

---

## 🎯 Verifikasi Deployment

1. Buka URL Frontend Anda (contoh: `https://coffee-house-web.vercel.app`).
2. Masuk ke halaman **Menu**, pastikan menu dari Supabase tampil.
3. Masuk ke halaman `/auth/login` dan coba login sebagai admin.
4. Selamat! Aplikasi Coffee House Anda sudah 100% Online! 🎉

---

### 💡 Catatan Penting
- **Pembaruan (Updates):** Karena terhubung dengan GitHub, setiap kali Anda melakukan `git push` ke branch `main`, Vercel akan otomatis melakukan *build* ulang pada Backend dan Frontend secara bersamaan.
- **Upload Gambar:** Jika Anda menggunakan folder lokal untuk upload gambar di backend (`/uploads`), pada platform *Serverless* seperti Vercel file yang diupload **tidak akan tersimpan secara permanen**. Untuk production jangka panjang, pertimbangkan untuk menyambungkan fitur upload backend langsung ke **Supabase Storage** atau layanan S3 bucket.
