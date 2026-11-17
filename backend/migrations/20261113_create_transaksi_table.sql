CREATE TABLE IF NOT EXISTS transaksi (
    id INT NOT NULL AUTO_INCREMENT,
    pendaftaran_id INT NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    metode VARCHAR(100) NOT NULL,
    status ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending',
    paid_at DATETIME NULL,
    PRIMARY KEY (id),
    INDEX idx_transaksi_pendaftaran_id (pendaftaran_id),
    CONSTRAINT fk_transaksi_pendaftaran
        FOREIGN KEY (pendaftaran_id) REFERENCES pendaftaran (id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
