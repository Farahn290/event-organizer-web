# Node.js backend

The API uses Node.js, Express, and MySQL. The database migrations create the
tables used by the app: `events`, `galeri`, `layanan`, `kontak`, and `users`.
The event-to-gallery relationship is added by a separate migration.

## Run locally

1. Install Node.js 20 or newer and make sure MySQL is running.
2. From the project root, enter the backend folder, copy `.env.example` to
   `.env`, and generate a private token secret:

   ```sh
   cd backend
   cp -n .env.example .env
   openssl rand -base64 48
   ```

   If `.env` already exists, keep it and add/update the required settings rather
   than replacing it. Put the generated value in `AUTH_TOKEN_SECRET`. Set
   `CORS_ORIGIN` to the comma-separated frontend origins allowed to call the API.

3. Create the database named in `DB_NAME`. For the example configuration:

   ```sh
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS event_organizer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

4. Apply the migrations in order. Replace `event_organizer` with the value of
   `DB_NAME` if you chose a different database:

   ```sh
   mysql -u root -p event_organizer < migrations/20261001_create_base_tables.sql
   mysql -u root -p event_organizer < migrations/20261009_add_event_id_to_galeri.sql
   mysql -u root -p event_organizer < migrations/20261113_add_role_to_users.sql
   mysql -u root -p event_organizer < migrations/20261113_add_created_by_to_events.sql
   mysql -u root -p event_organizer < migrations/20261113_create_tiket_table.sql
   mysql -u root -p event_organizer < migrations/20261113_create_pendaftaran_table.sql
   mysql -u root -p event_organizer < migrations/20261113_create_transaksi_table.sql
   ```

   The base migration uses `CREATE TABLE IF NOT EXISTS`, so it does not replace
   existing tables or data. Existing tables must already have the columns used
   by the API. Run the `event_id` migration only if `galeri.event_id` is not
   already present. The role migration adds `users.role` with allowed values
   `admin`, `panitia`, and `peserta`; existing and new users default to `peserta`.
   Before using admin features, promote existing administrator accounts with
   `UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';`.
   The event-owner migration adds `events.created_by` as a nullable reference to
   `users.id`; new events are associated with the authenticated creator.
   The ticket migration creates `tiket` with a required event reference, decimal
   price, required quota, and a sold count defaulting to zero.
   The registration migration creates `pendaftaran` with user, event, and ticket
   references, a pending-by-default status, and a creation timestamp. Deleting a
   referenced user, event, or ticket is restricted to preserve registrations.
   The transaction migration creates `transaksi` with a required registration
   reference and total, a pending-by-default status, and an optional payment time.

5. Install dependencies, create the first admin account using the interactive
   prompt (the password is not echoed), run tests, and start the API:

   ```sh
   npm install
   npm run create-admin
   npm test
   npm run dev
   ```

   The API listens on `http://localhost:8000`. Check `http://localhost:8000/api/health`
   to verify the server can connect to MySQL.

6. In another terminal, from the project root, start the frontend. Optionally
   set `VITE_API_URL` to the backend origin (without `/api`) when it is not
   running on `http://localhost:8000`:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

Uploaded gallery images are stored in `backend/uploads/` and served from `/uploads`.
The `.env` file and uploaded images are excluded from Git.

## Backend structure

`server.js` bootstraps the application and database connection. Route declarations
are grouped in `routes/`, endpoint handlers in the corresponding modules under
`controllers/`, and authentication, rate limiting, uploads, application setup,
and error handling in `middleware/`. Shared request validation and response
helpers are in `src/api-helpers.js`.

Public API routes provide event, service, and gallery listings, accept contact
requests, and expose the health check. Register participants through
`POST /api/auth/register` with `nama`, `email`, and a password of at least 12
characters; the account is always assigned the `peserta` role. Login is handled
by `/api/auth/login`. `POST /api/auth/logout` returns success; the client must
delete its token because logout does not revoke stateless tokens, which remain
valid until expiration. Event-management routes require an admin or panitia
account, while service, gallery, and contact-management routes require an admin
account. Login tokens include the user's role; role changes take effect when a
new token is issued or the current token expires. Authenticated users can view
and update their profile through `GET /api/profil` and `PUT /api/profil`
(`nama`, `email`), and change their password through
`PUT /api/profil/password` (`password_lama`, `password_baru`). Changing a
password does not revoke existing stateless tokens. The admin dashboard can
list and delete contact requests through `/api/kontak` and
`/api/kontak/delete`; tokens expire after eight hours. In development, if
`AUTH_TOKEN_SECRET` is omitted, the API generates a temporary secret and
invalidates admin sessions when restarted. Production requires an explicit
secret and `CORS_ORIGIN`. Helmet sets security headers globally. Login and
registration each have a separate limit of 10 requests per IP every 15 minutes;
excess requests receive `429`.

Anyone can view event tickets and their remaining quota (`kuota - terjual`)
through `GET /api/events/:eventId/tiket`. Admins and panitia can manage tickets
with `POST /api/events/:eventId/tiket`, `PUT /api/events/:eventId/tiket/:tiketId`,
and `DELETE /api/events/:eventId/tiket/:tiketId`. Create and update requests
use `nama_tiket`, `harga`, and `kuota`; `terjual` is managed by ticket sales and
cannot be changed through these routes. Kuota dan status selalu terbaru saat
diakses. A ticket cannot be deleted after it has been sold or referenced by a
registration. Panitia can only update or delete
their own events and manage tickets belonging to those events; admins are not
restricted by ownership.

Peserta yang login dapat membuat pendaftaran melalui `POST /api/pendaftaran`
dengan body `tiket_id` dan `jumlah`. Server mengunci tiket dan memperbarui
`terjual` secara kondisional dalam transaksi yang sama dengan pembuatan
pendaftaran; permintaan ditolak dengan `409` jika sisa kuota tidak cukup.
Peserta dapat melihat pendaftarannya melalui `GET /api/pendaftaran/saya` dan
membatalkan pendaftaran berstatus `pending` melalui
`PUT /api/pendaftaran/:id/batal`; pembatalan mengembalikan kuota dalam transaksi
yang sama. Admin dan panitia dapat melihat daftar peserta pada
`GET /api/events/:eventId/pendaftaran`; panitia hanya dapat melihat event miliknya.
Peserta dapat membuat tagihan untuk pendaftarannya yang masih `pending` melalui
`POST /api/transaksi` dengan `pendaftaran_id` dan `metode`; total dihitung dari
harga tiket dikali jumlah. Tagihan pending yang sudah ada mencegah duplikasi,
sedangkan tagihan berstatus `failed` dapat dicoba kembali. Admin mengonfirmasi
pembayaran melalui `PUT /api/transaksi/:id/konfirmasi`, yang secara atomik
mengubah transaksi menjadi `paid` dan pendaftaran menjadi `confirmed`. Peserta
dapat melihat tagihannya melalui `GET /api/transaksi/saya`. Rekap per event
tersedia di `GET /api/transaksi/rekap` untuk admin dan panitia; panitia hanya
melihat event miliknya. Rekap mencakup jumlah dan total transaksi per status.

Daftar event menerima filter `q` (nama/lokasi/kategori/label/produksi),
`kategori`, dan `tanggal`. Daftar pendaftaran peserta dapat difilter dengan
`status` dan `event_id`; daftar peserta per event menerima `status` dan `q`
(nama/email). Daftar transaksi peserta menerima `status` dan `event_id`, dan
rekap transaksi menerima `event_id` dan `status`. Semua daftar menerima `page`
(mulai dari 1) dan `limit` (default 20, maksimum 100); jika keduanya tidak diberikan,
respons tetap mengembalikan seluruh data agar kompatibel dengan klien lama.
Respons berpaginasi menambahkan metadata `pagination` berisi `page`, `limit`,
`total`, dan `total_pages`.

## API endpoint reference

Semua endpoint berada di bawah prefix `/api`. Endpoint ber-token menggunakan
header `Authorization: Bearer <token>`. Panitia hanya dapat mengelola event
miliknya. Endpoint daftar mendukung `page` dan `limit` jika disebutkan pada
fitur terkait.

| Modul | Method | Endpoint | Akses | Keterangan |
|---|---|---|---|---|
| Health | GET | `/api/health` | Publik | Cek API dan koneksi database |
| Auth | POST | `/api/auth/register` | Publik | Membuat akun peserta |
| Auth | POST | `/api/auth/login` | Publik | Login dan memperoleh token |
| Auth | POST | `/api/auth/logout` | Publik | Respons sukses; klien menghapus token stateless |
| Profil | GET | `/api/profil` | Semua role, wajib token | Profil pengguna saat ini |
| Profil | PUT | `/api/profil` | Semua role, wajib token | Ubah nama dan email |
| Profil | PUT | `/api/profil/password` | Semua role, wajib token | Ganti password |
| Events | GET | `/api/events` | Publik | Daftar; filter `q`, `kategori`, `tanggal` |
| Events | POST | `/api/events/create` | Admin, panitia | Buat event; `created_by` diambil dari token |
| Events | PUT | `/api/events/update` | Admin, pemilik event jika panitia | Ubah event |
| Events | DELETE | `/api/events/delete` | Admin, pemilik event jika panitia | Hapus event |
| Tiket | GET | `/api/events/:eventId/tiket` | Publik | Daftar tiket dan sisa kuota |
| Tiket | POST | `/api/events/:eventId/tiket` | Admin, panitia pemilik event | Buat tiket |
| Tiket | PUT | `/api/events/:eventId/tiket/:tiketId` | Admin, panitia pemilik event | Ubah tiket |
| Tiket | DELETE | `/api/events/:eventId/tiket/:tiketId` | Admin, panitia pemilik event | Hapus tiket yang belum terjual/dirujuk |
| Pendaftaran | POST | `/api/pendaftaran` | Peserta | Daftar tiket; kuota diperiksa secara atomik |
| Pendaftaran | GET | `/api/pendaftaran/saya` | Peserta | Daftar milik pengguna; filter `status`, `event_id` |
| Pendaftaran | PUT | `/api/pendaftaran/:id/batal` | Peserta pemilik pendaftaran | Batalkan pendaftaran pending |
| Pendaftaran | GET | `/api/events/:eventId/pendaftaran` | Admin, panitia pemilik event | Daftar peserta; filter `status`, `q` |
| Transaksi | POST | `/api/transaksi` | Peserta | Buat tagihan untuk pendaftaran pending |
| Transaksi | GET | `/api/transaksi/saya` | Peserta | Riwayat sendiri; filter `status`, `event_id` |
| Transaksi | GET | `/api/transaksi/rekap` | Admin, panitia | Rekap transaksi; panitia hanya event miliknya |
| Transaksi | PUT | `/api/transaksi/:id/konfirmasi` | Admin | Konfirmasi pembayaran dan pendaftaran |
| Layanan | GET | `/api/layanan` | Publik | Daftar layanan |
| Layanan | POST | `/api/layanan/create` | Admin | Buat layanan |
| Layanan | PUT | `/api/layanan/update` | Admin | Ubah layanan |
| Layanan | DELETE | `/api/layanan/delete` | Admin | Hapus layanan |
| Galeri | GET | `/api/galeri` | Publik | Daftar galeri |
| Galeri | POST | `/api/galeri/create` | Admin | Tambah item galeri |
| Galeri | POST | `/api/galeri/update` | Admin | Ubah item galeri |
| Galeri | POST | `/api/galeri/delete` | Admin | Hapus item galeri |
| Kontak | POST | `/api/kontak/create` | Publik | Kirim pesan kontak |
| Kontak | GET | `/api/kontak` | Admin | Daftar pesan kontak |
| Kontak | DELETE | `/api/kontak/delete` | Admin | Hapus pesan kontak |

## API testing materials

Import [`postman/event-organizer-api.postman_collection.json`](./postman/event-organizer-api.postman_collection.json)
ke Postman. Isi kredensial dan gunakan request login untuk menyimpan token
masing-masing role ke collection variables. Buat data uji sebelum mengisi ID;
request hapus bersifat destruktif dan hanya boleh dijalankan pada database uji.
Catat skenario, input, hasil yang diharapkan, hasil aktual, dan status pada
[`BLACK_BOX_TESTS.md`](./BLACK_BOX_TESTS.md). Skenario yang belum dieksekusi
ditandai `BELUM DIUJI`, bukan dianggap lulus.
