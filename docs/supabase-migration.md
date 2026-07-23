# Migrasi database KBK-NL ke Supabase

Dokumen ini memakai Supabase sebagai **managed PostgreSQL**, sementara arsitektur aplikasi tetap:

```text
Next.js frontend -> Express API -> Prisma -> Supabase Postgres
```

Frontend tidak perlu `supabase-js` dan tidak boleh menerima database password atau service-role key. Autentikasi admin tetap ditangani Express/JWT.

## 1. Buat project Supabase

1. Buat project baru di region yang dekat dengan lokasi deployment backend.
2. Simpan database password di password manager.
3. Buka **Connect** pada dashboard dan salin:
   - **Session pooler**, port `5432`.
   - **Direct connection**, port `5432`.
4. Jika password mengandung karakter khusus, percent-encode password saat dimasukkan ke connection string.

Referensi resmi: [Connect to Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres).

## 2. Konfigurasi environment

Dari folder `be/express`:

```powershell
Copy-Item .env.example .env
```

Isi `.env` tanpa pernah memasukkannya ke Git:

```dotenv
# Penting: kosongkan DB_URL lokal agar konfigurasi cloud di bawah yang dipakai.
DB_URL=""

# Runtime Express: gunakan Session pooler agar kompatibel dengan host IPv4.
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require"

# Prisma CLI/migration: gunakan Direct connection bila host mendukung IPv6.
# Jika tidak, Session pooler port 5432 juga dapat dipakai.
DIRECT_URL="postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require"

PORT=5000
NODE_ENV=production
FRONTEND_URLS="https://domain-frontend.example"
JWT_SECRET="ganti-dengan-secret-panjang"
JWT_EXPIRES_IN="2h"
SUPERADMIN_USERNAME="superadmin"
SUPERADMIN_PASSWORD="ganti-dengan-password-kuat"
```

Backend mempertahankan kompatibilitas dengan konfigurasi lama dan
memprioritaskan `DB_URL`. Karena itu, `DB_URL` harus kosong atau tidak ada pada
environment Supabase. Selama `DB_URL` berisi URL lokal, API, Prisma CLI, dan
seed akan tetap memilih database lokal.

Secret JWT dapat dibuat dengan:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Untuk API Express yang hidup terus, gunakan direct connection atau Session pooler. Transaction pooler port `6543` ditujukan untuk serverless/edge; bila terpaksa menggunakannya dengan Prisma, connection string perlu `?pgbouncer=true` dan pool aplikasi harus dibuat kecil.

Pada frontend:

```powershell
Copy-Item .env.example .env.local
```

```dotenv
NEXT_PUBLIC_API_URL="https://domain-api.example/api/v1"
```

## 3A. Supabase masih kosong

Gunakan jalur ini jika tidak ada data lama yang perlu dipindahkan.

```powershell
cd be/express
npm ci
npm run db:migrate
npm run seed
npm run db:status
```

`db:migrate` menjalankan dua migration yang sudah disiapkan:

1. Membuat enum, tabel, index, dan foreign key dari schema Prisma.
2. Mengaktifkan RLS tanpa policy publik, karena seluruh akses aplikasi melewati Express.

Setelah seed selesai, ganti `SUPERADMIN_PASSWORD` di environment deployment bila nilainya masih sementara.

## 3B. Memindahkan PostgreSQL yang sudah berisi data

Gunakan project Supabase baru/kosong. Jangan menjalankan `db:migrate` sebelum restore karena tabel aplikasi akan bertabrakan.

Pastikan `pg_dump`/`pg_restore` berasal dari versi PostgreSQL client yang sama atau lebih baru daripada database sumber. Untuk database proyek ini yang relatif kecil, custom-format dump sudah memadai:

```powershell
$env:SOURCE_DATABASE_URL = "postgresql://USER:PASSWORD@SOURCE_HOST:5432/SOURCE_DB"
$env:SUPABASE_SESSION_URL = "postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require"

pg_dump `
  --dbname="$env:SOURCE_DATABASE_URL" `
  --schema=public `
  --format=custom `
  --no-owner `
  --no-privileges `
  --no-subscriptions `
  --verbose `
  --file="kbk-public.dump"

pg_restore `
  --dbname="$env:SUPABASE_SESSION_URL" `
  --no-owner `
  --no-privileges `
  --exit-on-error `
  --verbose `
  "kbk-public.dump"
```

`--schema=public` penting agar schema managed milik Supabase seperti `auth` dan `storage` tidak disentuh. Untuk database besar, ikuti mode directory dan parallel jobs dari [panduan migrasi PostgreSQL resmi Supabase](https://supabase.com/docs/guides/platform/migrating-to-supabase/postgres).

### Baseline Prisma setelah restore

Atur `DIRECT_URL` ke target Supabase, lalu pastikan hasil restore sama dengan schema Prisma:

```powershell
$env:DIRECT_URL = $env:SUPABASE_SESSION_URL
npx prisma migrate diff `
  --from-config-datasource `
  --to-schema prisma/schema.prisma `
  --exit-code
```

- Exit code `0`: schema sama, lanjutkan.
- Exit code `2`: ada perbedaan. Jangan baseline dulu; periksa output diff dan selesaikan perbedaannya.

Catat migration schema awal sebagai sudah diterapkan, kemudian jalankan migration RLS:

```powershell
npx prisma migrate resolve --applied 20260723000100_init
npm run db:migrate
npm run db:status
```

Jangan menjalankan `prisma migrate reset` pada Supabase karena perintah itu menghapus data.

## 3C. Mengimpor handoff legacy data-only

Gunakan jalur ini jika arsip lama berisi schema staging dan data SQL, tetapi
strukturnya belum sama dengan schema Prisma terbaru. Script
`scripts/import-legacy-database.ts` akan:

- mempertahankan UUID data lama;
- membuat slug dosen dan publikasi yang stabil;
- menambahkan kolom baru dengan nilai aman;
- mengimpor data dalam satu transaksi;
- melakukan upsert sehingga aman dijalankan ulang untuk data yang sama.

Restore schema dan data handoff ke database sumber sementara terlebih dahulu.
Contoh berikut mengasumsikan database sementara sudah hidup di port `55432`:

```powershell
$env:LEGACY_DATABASE_URL = "postgresql://USER:PASSWORD@localhost:55432/LEGACY_DATABASE"
$env:TARGET_DATABASE_URL = "postgresql://USER:PASSWORD@localhost:5432/kbk-backend"

npm run db:migrate
npm run db:import:legacy
npm run seed
```

Untuk target Supabase, ganti hanya target import. Gunakan Session pooler port
`5432` bila direct connection IPv6 tidak dapat dijangkau:

```powershell
$env:SUPABASE_SESSION_URL = "postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require"

# Memaksa Prisma CLI ke Supabase meskipun .env masih memiliki DB_URL lokal.
$env:DB_URL = $env:SUPABASE_SESSION_URL
npm run db:migrate

$env:TARGET_DATABASE_URL = $env:SUPABASE_SESSION_URL
npm run db:import:legacy
npm run seed
npm run db:status
```

Script ini tidak menghapus tabel atau row target yang tidak termasuk dalam
handoff. Meski demikian, gunakan target kosong pada impor pertama agar konflik
unique key mudah didiagnosis.

## 4. Verifikasi data dan statistik

Perbarui planner statistics setelah restore:

```powershell
psql "$env:SUPABASE_SESSION_URL" -c "VACUUM VERBOSE ANALYZE;"
```

Bandingkan jumlah row database sumber dan target:

```sql
SELECT 'lecturers' AS table_name, COUNT(*) FROM lecturers
UNION ALL SELECT 'projects', COUNT(*) FROM projects
UNION ALL SELECT 'publications', COUNT(*) FROM publications
UNION ALL SELECT 'research_clusters', COUNT(*) FROM research_clusters
UNION ALL SELECT 'research_tags', COUNT(*) FROM research_tags
UNION ALL SELECT 'admins', COUNT(*) FROM "Admin";
```

Jalankan smoke test aplikasi setelah backend memakai Supabase:

```powershell
Invoke-RestMethod "http://localhost:5000/api/v1/research"
Invoke-RestMethod "http://localhost:5000/api/v1/lecturers/paginated?page=1&limit=1"
npm run test:endpoints
```

Tes juga dari UI:

- Beranda, People, Research Areas, Projects, dan Publications menampilkan data.
- Login admin berhasil.
- Create/edit/delete/restore satu record uji berhasil.
- Upload foto berhasil dan gambarnya tetap tersedia setelah backend direstart.

## 5. Keamanan Supabase

Migration kedua mengaktifkan RLS di semua tabel aplikasi dan sengaja tidak membuat policy untuk role `anon`/`authenticated`. Artinya Supabase Data API tidak menjadi jalur akses publik; Express tetap mengakses database memakai connection string server-side.

Supabase menyarankan RLS pada tabel di schema yang diekspos. Project baru juga dapat menonaktifkan Data API bila aplikasi hanya memakai koneksi PostgreSQL langsung. Lihat [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) dan [Securing your data](https://supabase.com/docs/guides/database/secure-data).

Jangan pernah menaruh salah satu nilai berikut di `NEXT_PUBLIC_*`:

- `DATABASE_URL` / `DIRECT_URL`
- database password
- Supabase secret key atau service-role key
- `JWT_SECRET`

## 6. Foto dosen bukan bagian dari database

Saat ini upload foto disimpan ke disk backend di `be/express/uploads/lecturers`, sedangkan database hanya menyimpan URL `/uploads/lecturers/...`. `pg_dump` tidak memindahkan file tersebut.

Sebelum production, pilih salah satu:

1. Migrasikan file ke Supabase Storage/object storage dan ubah upload handler agar menyimpan URL objek.
2. Gunakan persistent volume pada host Express, lalu salin seluruh folder `uploads/lecturers`.

Tanpa salah satu langkah ini, foto akan hilang saat filesystem deployment di-rebuild.

## 7. Cutover production dan rollback

Urutan cutover yang aman:

1. Lakukan rehearsal restore ke project Supabase uji.
2. Mulai maintenance window dan hentikan write ke database lama.
3. Buat dump final dan restore ke project target.
4. Baseline migration, deploy RLS, lalu jalankan `VACUUM ANALYZE`.
5. Ganti `DATABASE_URL` backend dan redeploy API.
6. Verifikasi row count, endpoint publik, login admin, dan satu siklus CRUD.
7. Arahkan frontend ke URL API production.
8. Pertahankan database lama dalam mode read-only selama masa observasi; jangan langsung menghapusnya.

Jika verifikasi gagal, kembalikan `DATABASE_URL` backend ke database lama, redeploy API, lalu buka kembali write pada database lama. Catat write yang sempat masuk ke Supabase sebelum melakukan percobaan cutover berikutnya.
