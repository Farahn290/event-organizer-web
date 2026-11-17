CREATE TABLE IF NOT EXISTS tiket (
    id INT NOT NULL AUTO_INCREMENT,
    event_id INT NOT NULL,
    nama_tiket VARCHAR(255) NOT NULL,
    harga DECIMAL(12, 2) NOT NULL,
    kuota INT UNSIGNED NOT NULL,
    terjual INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    INDEX idx_tiket_event_id (event_id),
    CONSTRAINT fk_tiket_event
        FOREIGN KEY (event_id) REFERENCES events (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
