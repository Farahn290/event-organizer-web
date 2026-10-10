ALTER TABLE galeri
ADD COLUMN event_id INT NULL,
ADD INDEX idx_galeri_event_id (event_id);
