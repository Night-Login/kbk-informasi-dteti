## PRD Website Profil Kelompok Keahlian DTETI

## 1. Ringkasan Produk

Website ini merupakan platform profil resmi Kelompok Keahlian DTETI yang berfungsi sebagai pusat informasi dosen, bidang riset, publikasi, proyek, kegiatan akademik, dan peluang kolaborasi. Website dirancang agar pihak eksternal dapat memahami kapasitas kelompok riset secara cepat melalui pendekatan berbasis topik penelitian.

MVP ditargetkan selesai pada awal Agustus 2026 dengan cakupan utama berupa website publik yang stabil, mudah diperbarui oleh admin, dan berisi data dasar yang akurat. Fitur otomasi crawling, dashboard dosen penuh, dan statistik akademik dinamis tidak dimasukkan ke MVP agar timeline lebih realistis.

## 2. Tujuan Produk

- 1. Menyediakan satu portal terpusat untuk profil dosen, topik riset, publikasi, dan proyek.

- 2. Memudahkan calon mahasiswa S2/S3 menemukan calon supervisor berdasarkan topik keahlian.

- 3. Memudahkan mitra industri melihat expertise dan proyek riset yang relevan.

- 4. Meningkatkan visibilitas kelompok riset secara profesional.

- 5. Menyediakan fondasi data yang siap dikembangkan untuk integrasi API/crawling pada fase berikutnya.

## 3. Target Pengguna

| Pengguna | Kebutuhan Utama |
| --- | --- |
| Peneliti/akademisi | Melihat bidang riset aktif, publikasi, dan potensi kolaborasi |
| Mitra industri | Menemukan dosen/topik yang cocok untuk kerja sama riset atau |
| proyek terapan |   |
| Calon mahasiswa | Menemukan supervisor berdasarkan topik, status bimbingan, dan |
| S2/S3 profil akademik |   |
| Admin | Mengelola profil dosen, berita, event, program akademik, dan tag |
| KBK/departemen riset |   |


| Dosen | Memiliki halaman profil akademik yang rapi dan mudah diperbarui |
| --- | --- |
|   | melalui admin/PIC |

## 4. Ruang Lingkup MVP

## 4.1 Fitur yang Masuk MVP

| Fitur | Deskripsi | Prioritas |
| --- | --- | --- |
| Home | Hero section, highlight research areas, profil singkat KBK, | Must Have |
| berita/event terbaru |   |   |
| Research Areas | Daftar cluster dan tag riset; klik tag menampilkan dosen | Must Have |
| dan publikasi terkait |   |   |
| People | Daftar dosen dengan filter nama dan tag riset | Must Have |
| Detail Profil Dosen Foto, nama, gelar, bio, email institusi, tag riset, status |   | Must Have |
|   | bimbingan, link SINTA/Scopus/Scholar, publikasi pilihan |   |
| Publications | Daftar publikasi dasar hasil input manual/import CSV; filter | Must Have |
| tahun, dosen, tag |   |   |
| Research & | Daftar proyek/riset aktif dan selesai; input manual oleh | Should |
| Projects admin |   | Have |
| Academic | Informasi S2/S3 (beasiswa, cara menghubungi calon | Must Have |
| Programs supervisor) |   |   |
| News | Berita/pengumuman kelompok | Should |
|   |   | Have |
| Events | Upcoming event dan arsip kegiatan (gelombang masuk | Should |
| pendaftaran) |   | Have |
| Contact | Alamat, email, peta, media sosial, dan form kontak | Must Have |
| sederhana |   |   |
| Admin Dashboard | CRUD dosen, tag, publikasi, project, news, event, halaman | Must Have |
| Minimal statis |   |   |
| Import CSV/Excel | Import awal publikasi agar tidak input satu-satu | Should |
| Publikasi |   | Have |


| SEO Dasar | Meta title, description, Open Graph, sitemap, robots.txt | Must Have |
| --- | --- | --- |
| Responsive | Tampilan optimal di desktop dan mobile | Must Have |
| Design |   |   |

## 4.2 Fitur yang Ditunda ke Post-MVP

| Fitur | Alasan Ditunda |
| --- | --- |
| Crawling SINTA otomatis | Risiko perubahan struktur web dan perlu review |
|   | layer |
| OpenAlex/Semantic Scholar sync | Butuh mapping author dan deduplication publikasi |
| otomatis |   |
| Dashboard dosen mandiri | Membutuhkan role, auth, approval flow, dan UX |
|   | tambahan |
| Statistik publikasi/h-index agregat | Bergantung pada integrasi data yang valid |
| Adaptive tagging otomatis | Butuh data publikasi cukup dan proses validasi |
| Co-author network visualization | Kompleksitas visualisasi dan data graph lebih |
|   | tinggi |
| Inquiry supervisor langsung ke dosen Perlu kebijakan privasi, routing email, dan approval |   |
| Integrasi SIMASTER/Scopus penuh | Bergantung akses institusi/API key |

## 5. User Flow Utama

## 5.1 Calon Mahasiswa Mencari Supervisor

- 1. User membuka halaman Research Areas.

- 2. User memilih tag riset, misalnya Machine Learning atau Cybersecurity.

- 3. Sistem menampilkan dosen yang memiliki tag tersebut.

- 4. User membuka profil dosen.

- 5. User melihat bio, publikasi, status bimbingan, dan link profil eksternal.

- 6. User menghubungi dosen melalui email institusi atau mengikuti instruksi Academic Programs.

## 5.2 Mitra Industri Mencari Keahlian

- 1. User membuka Research & Projects atau Research Areas.


- 2. User memfilter berdasarkan topik atau status proyek.

- 3. User melihat daftar dosen/proyek terkait.

- 4. User membuka halaman Contact untuk menghubungi KBK.

## 5.3 Admin Mengelola Konten

- 1. Admin login ke dashboard.

- 2. Admin menambahkan/memperbarui data dosen.

- 3. Admin mengatur tag riset menggunakan controlled vocabulary.

- 4. Admin mengimpor publikasi awal melalui CSV/Excel.

- 5. Admin mempublikasikan berita, event, dan halaman akademik.

## 6. Kebutuhan Non-Fungsional

| Aspek | Requirement |
| --- | --- |
| Performance | Halaman utama dan daftar dosen dimuat cepat; target Lighthouse |
| Performance minimal 80 |   |
| Security | Admin dashboard wajib login; role-based access minimal |
| admin/superadmin |   |
| Reliability | Backup database minimal harian |
| Maintainability Struktur data rapi dan siap untuk integrasi API/crawling fase berikutnya |   |
| SEO | Setiap dosen, publikasi, dan research area memiliki slug dan metadata |
| Accessibility | Kontras teks baik, navigasi jelas, alt text untuk gambar |
| Responsivenes | Mobile-first atau minimal fully responsive |
| s |   |
| Data Validity | Publikasi dan profil memiliki status validasi manual sebelum tampil publik |

## 7. Rekomendasi Stack MVP

| Layer | Rekomendasi |
| --- | --- |
| Frontend | Next.js + TypeScript + Tailwind |
| Backend/Admin Directus / Strapi / custom admin sederhana |   |
| Database PostgreSQL |   |


| ORM | Prisma jika custom backend |
| --- | --- |
| Storage Media | Local server storage / S3-compatible / Supabase Storage |
| Deployment | VPS institusi / cloud / Vercel + managed database |
| Import Data | CSV/Excel parser untuk publikasi dan profil dosen |
| Future Crawling Python service terpisah agar tidak mengganggu core web |   |
|   | app |

Untuk MVP, pilihan paling cepat biasanya:

- Next.js untuk frontend.

- Directus atau Strapi untuk admin dashboard agar CRUD tidak perlu dibuat dari nol.

- PostgreSQL sebagai database utama.

- Import CSV untuk publikasi awal.

## 8. Timeline Pengembangan MVP

Asumsi mulai efektif: 10 Juni 2026 Target soft launch MVP: 5–7 Agustus 2026

| Periode | Fokus | Output |
| --- | --- | --- |
| 25–28 Juni Kickoff, finalisasi scope, |   | Scope MVP final, daftar halaman, PIC tiap bagian, |
|   | dan pembagian role | kebutuhan data dosen, template input data |
| 29 Juni–3 | Data model, IA, dan | ERD awal, struktur menu final, controlled vocabulary |
| Juli | setup awal project | tag riset v1, repo, environment, database awal |
| 4–7 Juli | Setup CMS/admin dan | Admin dashboard dasar, auth admin, staging |
|   | deployment staging | environment, struktur collection/table utama |
| 8–14 Juli | Implementasi halaman | Home, People, Research Areas, Contact, layout |
|   | publik dasar responsive |   |
| 15–20 Juli Profil dosen dan sistem |   | Halaman detail profil dosen, relasi dosen-tag, filter |
|   | tagging | nama/topik, link SINTA/Scopus/Google Scholar |
|   | 21–25 Juli Publications dan | Daftar publikasi dasar, import CSV/manual input, |
|   | Research & Projects | filter tahun/dosen/tag, halaman research & projects |
| 26–30 Juli Academic Programs, |   | Halaman S2/S3 dan beasiswa, CRUD berita, CRUD |
|   | News, Events | event, konten statis utama |


| 31 Juli–3 | Integrasi konten dan QA | Data dosen masuk ke sistem, validasi tampilan, |
| --- | --- | --- |
| Agustus | awal | pengecekan responsive, perbaikan bug prioritas |
| 4–6 | SEO dasar, content | Sitemap, metadata, title/description, finalisasi |
| Agustus | freeze, dan dokumentasi | konten, dokumentasi admin singkat |
| 7–9 | UAT internal | Review dosen/admin/PIC, revisi minor, pengecekan |
| Agustus |   | konten dan flow utama |
| 10 Agustus Soft launch MVP |   | Website live/staging final, handover admin, daftar |
|   |   | backlog post-MVP |

## 9. Milestone

| Milestone | Target | Kriteria Selesai |
| --- | --- | --- |
|   | Tanggal |   |
| Kickoff & Scope | 28 Juni | Scope MVP disepakati, fitur post-MVP dipisahkan, role |
| Freeze | tim jelas |   |
| Data Model Freeze 3 Juli |   | ERD, field utama, relasi, struktur menu, dan controlled |
|   |   | vocabulary v1 selesai |
| Staging Online | 7 Juli | CMS/admin dan frontend bisa diakses internal |
| Core Pages Done | 14 Juli | Home, People, Research Areas, Contact selesai |
|   |   | secara struktur dan responsive |
| Lecturer Profile | 20 Juli | Detail profil dosen, tagging, filter, dan external profile |
| Done | link selesai |   |
| Publications & | 25 Juli | Publikasi dasar, import/input manual, filter, dan |
| Projects Done |   | halaman projects selesai |
| Content Pages | 30 Juli | Academic Programs, News, Events, dan halaman |
| Done |   | statis utama selesai |
| MVP Freeze | 3 Agustus | Tidak ada fitur baru; hanya bugfix, validasi konten, dan |
|   |   | perbaikan minor |
| UAT Internal | 7–9 Agustus Website direview internal dan revisi minor selesai |   |
| Soft Launch | 10 Agustus Website siap dipresentasikan/dipakai publik terbatas |   |

## 10. Review Tipe Data


Secara umum, tipe data di dokumen awal sudah cukup untuk kebutuhan konsep. Namun, untuk implementasi database, masih perlu dibuat lebih spesifik. Beberapa field sebaiknya tidak hanya ditulis sebagai Text/Numeric/Boolean, tetapi dibuat sebagai string, enum, relation, media, JSON, timestamp, dan status validasi.

## 10.1 Catatan Utama

- 1. NIP/Staff ID sudah benar sebagai text/string, bukan number.

- 2. SINTA ID dan Scopus Author ID sebaiknya disimpan sebagai string, bukan numeric murni, agar aman dari format ID panjang, leading zero, atau perubahan format.

- 3. Status bimbingan sebaiknya enum, bukan boolean, karena realitanya bisa “Terbuka”, “Terbatas”, “Tutup”, atau “Hubungi terlebih dahulu”.

- 4. Tag topik penelitian harus berupa many-to-many relation, bukan array text biasa.

- 5. Publikasi perlu field deduplication seperti DOI, external_id, source, dan verified_status.

- 6. Semua konten publik sebaiknya punya slug, SEO metadata, status publikasi, created_at, updated_at.

- 7. Perlu field is_active atau visibility agar data bisa disembunyikan tanpa dihapus.

- 8. Perlu audit trail sederhana untuk data yang diedit admin.

## 11. Usulan Data Model MVP

## 11.1 Lecturer / Dosen

| Field | Tipe Data Wajib |   | Catatan |
| --- | --- | --- | --- |
| id | UUID | Ya | Primary key |
| full_name | String | Ya | Nama lengkap |
| academic_title | String | Ya | Gelar depan/belakang bisa digabung untuk |
|   |   |   | MVP |
| slug | String | Ya | Untuk URL profil |
|   | unique |   |   |
| nip_or_staff_id | String | Ya | Jangan number |
| email | String/email Ya |   | Email institusi |
| photo_url | Media/String Ya |   | Min. 400x400px |
| bio | Text | Ya | Maks. 300 kata |
| expertise_summar | Text | Opsional Ringkasan 1–2 kalimat untuk kartu profil |   |
| y |   |   |   |


| sinta_id | String | Ya | Untuk fase integrasi |
| --- | --- | --- | --- |
| scopus_author_id String |   | Opsional Untuk fase integrasi |   |
| google_scholar_ur | String/URL Opsional Link eksternal |   |   |
| l |   |   |   |
| orcid_id | String | Opsional Tambahan bagus untuk akademik |   |
| supervision_status Enum |   | Ya | OPEN, LIMITED, CLOSED, |
|   |   |   | CONTACT_FIRST |
| supervision_note Text |   | Opsional Contoh: “menerima topik AI/ML” |   |
| is_active | Boolean | Ya | Aktif/tidak ditampilkan |
| sort_order | Integer | Opsional Urutan tampil |   |
| created_at | Timestamp Ya |   | Audit |
| updated_at | Timestamp Ya |   | Audit |

## 11.2 ResearchTag

| Field | Tipe Data Wajib |   | Catatan |
| --- | --- | --- | --- |
| id | UUID | Ya | Primary key |
| name | String | Ya | Contoh: Machine Learning |
| slug | String unique Ya |   | URL tag |
| cluster_id UUID relation Ya |   |   | Relasi ke cluster |
| description Text |   | Opsional Penjelasan tag |   |
| is_active Boolean |   | Ya | Untuk controlled vocabulary |

## 11.3 ResearchCluster

| Field | Tipe Data Wajib |   | Catatan |
| --- | --- | --- | --- |
| id | UUID | Ya | Primary key |
| name | String | Ya | Contoh: Intelligent Systems & Data |
| slug | String unique Ya |   | URL cluster |


| description Text |   | Opsional Penjelasan cluster |
| --- | --- | --- |
| sort_order | Integer | Opsional Urutan tampilan |

## 11.4 LecturerResearchTag

| Field | Tipe Data Wajib | Catatan |
| --- | --- | --- |
| lecturer_id UUID relation Ya |   | Relasi dosen |
| tag_id | UUID relation Ya | Relasi tag |
| is_primary Boolean |   | Opsional Untuk tag utama |
|   |   | dosen |

## 11.5 Publication

| Field | Tipe Data Wajib |   | Catatan |
| --- | --- | --- | --- |
| id | UUID | Ya | Primary key |
| title | Text | Ya | Judul publikasi |
| slug | String | Ya | URL publikasi |
|   | unique |   |   |
| year | Integer | Ya | Tahun |
| publication_date Date |   | Opsional Jika tersedia |   |
| authors_text | Text | Ya | Nama author mentah dari sumber |
| venue | String | Opsional Jurnal/konferensi |   |
| publication_type Enum |   | Opsional JOURNAL, CONFERENCE, BOOK_CHAPTER, |   |
|   |   |   | PREPRINT, OTHER |
| doi | String | Opsional Untuk deduplication |   |
| url | String/URL Opsional Link publikasi |   |   |
| abstract | Text | Opsional Jika tersedia |   |
| citation_count | Integer | Opsional Untuk fase sync |   |
| source | Enum | Ya | MANUAL, CSV_IMPORT, OPENALEX, |
|   |   |   | SEMANTIC_SCHOLAR, SCOPUS, SINTA |


| external_ids | JSON | Opsional OpenAlex ID, Scopus EID, Semantic Scholar ID |
| --- | --- | --- |
| verified_status Enum |   | Ya DRAFT, NEEDS_REVIEW, VERIFIED, |
|   |   | REJECTED |
| is_featured | Boolean | Opsional Untuk highlight |
| created_at | Timestamp Ya | Audit |
| updated_at | Timestamp Ya | Audit |

## 11.6 PublicationAuthor

| Field | Tipe Data Wajib | Catatan |
| --- | --- | --- |
| publication_id UUID relation Ya |   | Relasi publikasi |
| lecturer_id | UUID relation Opsional Jika author adalah dosen |   |
|   | internal |   |
| author_name String | Ya | Nama author |
| author_order | Integer | Opsional Urutan author |

## 11.7 Project

| Field | Tipe Data Wajib |   | Catatan |
| --- | --- | --- | --- |
| id | UUID | Ya | Primary key |
| title | String | Ya | Judul proyek |
| slug | String unique Ya |   | URL proyek |
| description | Text | Ya | Deskripsi singkat |
| status | Enum | Ya | PLANNED, ONGOING, COMPLETED |
| start_year | Integer | Opsional Tahun mulai |   |
| end_year | Integer | Opsional Tahun selesai |   |
| partner_names Text/JSON Opsional Mitra eksternal |   |   |   |
| funding_source String |   | Opsional Jika boleh ditampilkan |   |
| visibility | Enum | Ya | PUBLIC, INTERNAL, HIDDEN |


| created_at | Timestamp | Ya | Audit |
| --- | --- | --- | --- |
| updated_at | Timestamp | Ya | Audit |

## 11.8 News

| Field | Tipe Data | Wajib | Catatan |
| --- | --- | --- | --- |
| id | UUID | Ya Primary key |   |
| title | String | Ya Judul |   |
| slug | String unique | Ya URL |   |
| excerpt | Text | Opsional Ringkasan |   |
| content | Rich Text/Markdown Ya | Isi berita |   |
|   | cover_image_url Media/String | Opsional Gambar |   |
| published_at | Timestamp | Opsional Jadwal publikasi |   |
| status | Enum | Ya | DRAFT, PUBLISHED, ARCHIVED |
| seo_title | String | Opsional SEO |   |
| seo_description Text |   | Opsional SEO |   |

## 11.9 Event

| Field | Tipe Data Wajib |   | Catatan |
| --- | --- | --- | --- |
| id | UUID | Ya | Primary key |
| title | String | Ya | Nama event |
| slug | String unique Ya |   | URL |
| description | Text | Ya | Deskripsi |
| start_datetime | Timestamp | Ya | Waktu mulai |
| end_datetime | Timestamp Opsional Waktu selesai |   |   |
| location | String | Opsional Lokasi fisik |   |
| online_url | String/URL Opsional Link meeting/event |   |   |


| status | Enum | Ya | UPCOMING, COMPLETED, CANCELLED |
| --- | --- | --- | --- |
| cover_image_url Media/String Opsional Poster |   |   |   |

## 11.10 StaticPage

| Field | Tipe Data | Wajib | Catatan |
| --- | --- | --- | --- |
| id | UUID | Ya Primary key |   |
| title | String | Ya Judul halaman |   |
| slug | String unique | Ya | Contoh: about, contact, |
|   |   |   | academic-programs |
| content | Rich Text/Markdown Ya | Isi halaman |   |
| status | Enum | Ya | DRAFT, PUBLISHED |
| seo_title | String | Opsional SEO |   |
| seo_descriptio | Text | Opsional SEO |   |
| n |   |   |   |

## 12. Kebutuhan Data yang Masih Kurang

Berikut field yang sebaiknya ditambahkan dari dokumen awal:

- 1. Slug untuk dosen, tag, publikasi, proyek, berita, dan event.

- 2. SEO title dan SEO description untuk halaman penting.

- 3. Status publikasi konten: draft, published, archived.

- 4. Verification status untuk publikasi hasil import/crawling.

- 5. Source metadata untuk publikasi: manual, CSV, OpenAlex, Scopus, SINTA, dan lain-lain.

- 6. External IDs untuk publikasi agar siap deduplication ketika API sync dibuat.

- 7. Role dan permission admin.

- 8. Audit fields: created_at, updated_at, created_by, updated_by.

- 9. Visibility/is_active agar data bisa disembunyikan tanpa dihapus.

- 10. Enum supervision_status yang lebih fleksibel daripada boolean.

- 11. ORCID ID sebagai tambahan opsional.

- 12. Field bilingual jika website ingin siap internasional, minimal bio_id dan bio_en untuk fase berikutnya.

- 13. Field sort_order untuk mengatur urutan dosen, cluster, dan konten unggulan.


- 14. Field featured/highlight untuk menampilkan publikasi, proyek, atau berita pilihan di homepage.

## 13. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Data dosen terlambat | MVP kosong atau tidak | Gunakan template Excel dan |
| terkumpul | lengkap | tetapkan deadline data awal |
| Scope melebar ke | Timeline molor | Crawling dimasukkan post-MVP |
| crawling/API |   |   |
| Publikasi banyak dan format | Import gagal/duplikat Gunakan template CSV baku dan |   |
| tidak rapi |   | validasi manual |
| Tag riset tidak konsisten | Filter tidak berguna | Gunakan controlled vocabulary dan |
|   |   | approval admin |
| Admin dashboard terlalu | Dev time habis | Pakai Directus/Strapi atau CRUD |
| kompleks |   | minimal |
| Konten S2/S3/beasiswa | Informasi cepat usang Tetapkan admin konten dan jadwal |   |
| berubah |   | update berkala |
| Server/subdomain belum | Launch tertunda | Siapkan staging di cloud sementara |
| siap |   |   |

## 14. Definition of Done MVP

MVP dianggap selesai jika:

- 1. Website dapat diakses di staging/live URL.

- 2. Halaman Home, Research Areas, People, Profil Dosen, Publications, Academic Programs, News/Events, dan Contact tersedia.

- 3. Minimal seluruh dosen KBK memiliki profil dasar.

- 4. Setiap dosen memiliki tag riset dan link eksternal akademik minimal SINTA.

- 5. Publikasi awal dapat ditampilkan dari input manual atau import CSV.

- 6. Admin dapat mengelola konten utama tanpa mengubah kode.

- 7. Website responsive di mobile dan desktop.

- 8. SEO dasar aktif: title, description, sitemap, dan metadata halaman.

- 9. Konten sudah direview oleh PIC/internal.

- 10. Ada dokumentasi singkat untuk admin/maintainer.


## 15. Rekomendasi Scope Final MVP

Masuk MVP:

- Website publik lengkap.

- Profil dosen.

- Research areas dan tagging manual.

- Publikasi dasar via manual/CSV import.

- Research & projects manual.

- Academic programs.

- News dan events.

- Contact.

- Admin dashboard minimal.

- SEO dasar.

Tidak masuk MVP:

- Crawling otomatis SINTA.

- OpenAlex/Semantic Scholar sync.

- Dashboard dosen mandiri.

- Statistik publikasi otomatis.

- Adaptive tagging.

- Co-author graph.

- Inquiry supervisor otomatis.
