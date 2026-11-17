ALTER TABLE users
ADD COLUMN role ENUM('admin', 'panitia', 'peserta') NOT NULL DEFAULT 'peserta';
