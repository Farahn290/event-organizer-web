# Tabel pengujian black box

Jalankan terhadap database uji dengan akun peran `admin`, `panitia`, dan
`peserta`. Isi variabel ID dan kredensial pada koleksi Postman
[`postman/event-organizer-api.postman_collection.json`](./postman/event-organizer-api.postman_collection.json).
Jangan jalankan skenario yang mengubah atau menghapus data pada database produksi.

Nilai `Belum dijalankan` berarti hasil aktual belum diobservasi; ubah kolom
status menjadi `LULUS` atau `GAGAL` setelah hasil aktual dibandingkan dengan
hasil yang diharapkan.

| Skenario | Input | Hasil diharapkan | Hasil aktual | Status |
|---|---|---|---|---|
| Health check | `GET /api/health` | HTTP 200 jika API dan database tersedia | Belum dijalankan | BELUM DIUJI |
| Register peserta valid | `POST /api/auth/register`, nama/email unik, password >= 12 karakter | HTTP 201; role otomatis `peserta` | Belum dijalankan | BELUM DIUJI |
| Register password pendek | `POST /api/auth/register`, password di bawah 12 karakter | HTTP 400; akun tidak dibuat | Belum dijalankan | BELUM DIUJI |
| Register email duplikat | `POST /api/auth/register`, email yang sudah terdaftar | HTTP 409; akun lama tidak berubah | Belum dijalankan | BELUM DIUJI |
| Login valid | `POST /api/auth/login`, kredensial valid untuk masing-masing role | HTTP 200; token berisi user dan role | Belum dijalankan | BELUM DIUJI |
| Login gagal | `POST /api/auth/login`, password salah | HTTP 401 | Belum dijalankan | BELUM DIUJI |
| Logout stateless | `POST /api/auth/logout` | HTTP 200; klien menghapus token | Belum dijalankan | BELUM DIUJI |
| Profil tanpa token | `GET /api/profil`, tanpa Authorization | HTTP 401 | Belum dijalankan | BELUM DIUJI |
| Lihat profil sendiri | `GET /api/profil`, token valid | HTTP 200; data sesuai pemilik token | Belum dijalankan | BELUM DIUJI |
| Perbarui profil | `PUT /api/profil`, nama dan email valid | HTTP 200; profil pengguna berubah | Belum dijalankan | BELUM DIUJI |
| Ganti password salah | `PUT /api/profil/password`, password lama salah | HTTP 400; password tidak berubah | Belum dijalankan | BELUM DIUJI |
| Filter dan paginasi event | `GET /api/events?page=1&limit=2&q=...` | HTTP 200; data sesuai filter dan metadata pagination benar | Belum dijalankan | BELUM DIUJI |
| Buat event sebagai panitia | `POST /api/events/create`, token panitia dan data valid | HTTP 200; `created_by` menunjuk panitia pemilik | Belum dijalankan | BELUM DIUJI |
| Buat event sebagai peserta | `POST /api/events/create`, token peserta | HTTP 403; event tidak dibuat | Belum dijalankan | BELUM DIUJI |
| Panitia mengubah event orang lain | `PUT /api/events/update`, ID event milik panitia lain | HTTP 403; event tidak berubah | Belum dijalankan | BELUM DIUJI |
| Lihat tiket dan sisa kuota | `GET /api/events/:eventId/tiket` | HTTP 200; `sisa_kuota = kuota - terjual` pada saat diakses | Belum dijalankan | BELUM DIUJI |
| Buat tiket valid | `POST /api/events/:eventId/tiket`, token admin/panitia, harga dan kuota valid | HTTP 201; tiket terkait dengan event | Belum dijalankan | BELUM DIUJI |
| Panitia membuat tiket event orang lain | `POST /api/events/:eventId/tiket`, token panitia dan ID event milik panitia lain | HTTP 403; tiket tidak dibuat | Belum dijalankan | BELUM DIUJI |
| Perbarui kuota di bawah terjual | `PUT /api/events/:eventId/tiket/:tiketId`, kuota < `terjual` | HTTP 409; data tiket tidak berubah | Belum dijalankan | BELUM DIUJI |
| Hapus tiket yang telah terjual | `DELETE /api/events/:eventId/tiket/:tiketId`, tiket dengan `terjual` > 0 | HTTP 409; tiket tetap ada | Belum dijalankan | BELUM DIUJI |
| Pendaftaran kuota tersedia | `POST /api/pendaftaran`, token peserta, tiket tersedia, jumlah positif | HTTP 201; status `pending`; jumlah terjual bertambah | Belum dijalankan | BELUM DIUJI |
| Pendaftaran melebihi kuota | `POST /api/pendaftaran`, jumlah lebih besar dari sisa kuota | HTTP 409; pendaftaran tidak dibuat dan kuota tidak berubah | Belum dijalankan | BELUM DIUJI |
| Daftar pendaftaran sendiri | `GET /api/pendaftaran/saya?status=pending&page=1&limit=20` | HTTP 200; hanya data peserta tersebut dan filter diterapkan | Belum dijalankan | BELUM DIUJI |
| Daftar peserta event milik panitia | `GET /api/events/:eventId/pendaftaran`, token panitia pemilik | HTTP 200; daftar hanya untuk event tersebut | Belum dijalankan | BELUM DIUJI |
| Batalkan pendaftaran pending | `PUT /api/pendaftaran/:id/batal`, token pemilik, status `pending` | HTTP 200; status `cancelled` dan kuota dikembalikan | Belum dijalankan | BELUM DIUJI |
| Batalkan pendaftaran non-pending | `PUT /api/pendaftaran/:id/batal`, status `confirmed` atau `cancelled` | HTTP 409; status dan kuota tidak berubah | Belum dijalankan | BELUM DIUJI |
| Buat tagihan | `POST /api/transaksi`, pendaftaran pending milik peserta | HTTP 201; total = harga x jumlah; status `pending` | Belum dijalankan | BELUM DIUJI |
| Duplikasi tagihan pending | Ulangi `POST /api/transaksi` untuk pendaftaran dengan tagihan pending | HTTP 409; tidak ada tagihan pending duplikat | Belum dijalankan | BELUM DIUJI |
| Konfirmasi pembayaran admin | `PUT /api/transaksi/:id/konfirmasi`, token admin, transaksi pending | HTTP 200; transaksi `paid` dan pendaftaran `confirmed` | Belum dijalankan | BELUM DIUJI |
| Konfirmasi pembayaran panitia | `PUT /api/transaksi/:id/konfirmasi`, token panitia | HTTP 403; status transaksi tidak berubah | Belum dijalankan | BELUM DIUJI |
| Rekap transaksi panitia | `GET /api/transaksi/rekap`, token panitia dan `event_id` | HTTP 200; rekap terbatas pada event milik panitia | Belum dijalankan | BELUM DIUJI |
| Registrasi serentak, kuota 50 | 100 `POST /api/pendaftaran`, 50 koneksi, masing-masing jumlah 1 | Maksimal 50 berhasil; sisanya HTTP 409; tidak oversell | 50 HTTP 201, 50 HTTP 409; 50 baris pendaftaran; `terjual=50`, sisa 0 | LULUS |
