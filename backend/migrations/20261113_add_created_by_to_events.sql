ALTER TABLE events
ADD COLUMN created_by INT NULL,
ADD INDEX idx_events_created_by (created_by),
ADD CONSTRAINT fk_events_created_by
    FOREIGN KEY (created_by) REFERENCES users (id)
    ON DELETE SET NULL;
