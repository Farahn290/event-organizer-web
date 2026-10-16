# Node.js backend

The API uses Node.js, Express, and MySQL. It expects the existing database tables
used by the app: `events`, `galeri`, `layanan`, `kontak`, and `users`.

## Run locally

1. Install Node.js 20 or newer and make sure MySQL is running.
2. Copy `.env.example` to `.env` and set the MySQL database name, username, and
   password for your local database.
3. Install and start the API:

   ```sh
   cd backend
   npm install
   npm run dev
   ```

   The API listens on `http://localhost:8000`. Check `http://localhost:8000/api/health`
   to verify the server can connect to MySQL.

4. In another terminal, start the frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

Uploaded gallery images are stored in `backend/uploads/` and served from `/uploads`.
The `.env` file and uploaded images are excluded from Git.
