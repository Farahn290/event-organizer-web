CREATE TABLE IF NOT EXISTS pendaftaran (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    tiket_id INT NOT NULL,
    jumlah INT UNSIGNED NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_pendaftaran_user_id (user_id),
    INDEX idx_pendaftaran_event_id (event_id),
    INDEX idx_pendaftaran_tiket_id (tiket_id),
    CONSTRAINT fk_pendaftaran_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_pendaftaran_event
        FOREIGN KEY (event_id) REFERENCES events (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_pendaftaran_tiket
        FOREIGN KEY (tiket_id) REFERENCES tiket (id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
