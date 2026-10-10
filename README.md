# NutriDaily Frontend (Standalone Demo)

Aplikasi antarmuka web (frontend) **NutriDaily Indonesia** yang berdiri sendiri (*standalone frontend*). Semua data telah menggunakan **hardcoded dummy data** berkualitas tinggi sehingga seluruh fitur dan halaman dapat dijalankan, didemonstrasikan, dan diuji secara mandiri tanpa memerlukan server backend.

---

## 📌 Karakteristik Proyek

1. **Root Direktori Bersih**: Proyek ini langsung berada di root folder `Nutridaily Frontend` tanpa adanya sub-folder `frontend/` bersarang.
2. **100% Mock / Dummy Data**: Seluruh interaksi API (`recipesApi`, `subscriptionApi`, `accountApi`, `authApi`, `paymentsApi`) ditangani oleh layer mock di [`src/lib/api-client.ts`](src/lib/api-client.ts) dan sumber data di [`src/data/mock-data.ts`](src/data/mock-data.ts).
3. **Interaktif & Responsif**:
   - **Swap Menu**: Pengguna dapat menukar menu harian dan melihat perubahannya secara real-time.
   - **Pause / Resume Langganan**: Status langganan dapat diubah secara interaktif.
   - **Dashboard & Akun Pelanggan**: Menggunakan profil dummy (`Joshua Michael`) dengan langganan aktif, alamat pengiriman kantor & apartemen, riwayat invoice, serta log audit login.
   - **Clean Label & Sertifikasi Lab**: 30 resep diverifikasi lengkap dengan sertifikasi PT Saraswanti Indo Genetech (SIG Lab), asal panen petani lokal, serta unduh sertifikat PDF.
   - **Checkout & Faktur**: Simulasi checkout paket langganan dengan penerbitan nomor invoice instan.
   - **Login & Logout**: Pengguna dapat menguji status login maupun logout (*guest preview*). Perubahan state disimpan ke `localStorage`.

---

## 🚀 Panduan Menjalankan

### 1. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 2. Membangun untuk Produksi (Build)
```bash
npm run build
npm run start
```

---

## 📂 Struktur Direktori

```text
Nutridaily Frontend/
├── public/                 # Aset statis, foto menu makanan, logo brand & icon
│   ├── brand/
│   ├── icons/
│   └── images/meals/       # 20+ foto resolusi tinggi untuk seluruh menu
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── account/        # Portal akun, profil, keamanan, alamat & invoice
│   │   ├── checkout/       # Simulasi checkout langganan
│   │   ├── dashboard/      # Dashboard status langganan & kalender katering
│   │   ├── verify/         # Clean label barcode/QR verification & sertifikat PDF
│   │   ├── page.tsx        # Beranda & kalkulator TDEE klinis
│   │   └── layout.tsx
│   ├── components/         # Komponen UI (menu swapper, hero, dll.)
│   ├── data/
│   │   ├── clean-label-data.ts
│   │   └── mock-data.ts    # 30 katalog resep, data lab, user & sesi dummy
│   └── lib/
│       ├── api-client.ts   # Mock API client mandiri
│       ├── auth-context.tsx
│       └── pdf-certificate.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```
