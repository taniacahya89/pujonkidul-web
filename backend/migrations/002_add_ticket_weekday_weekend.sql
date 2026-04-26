-- ============================================================
-- Migration 002: Tambah kolom ticket_weekday dan ticket_weekend
-- Jalankan ini pada database production yang sudah ada
-- Idempotent: menggunakan ADD COLUMN IF NOT EXISTS
-- ============================================================

ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS ticket_weekday INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ticket_weekend INTEGER NOT NULL DEFAULT 0;

-- Isi nilai berdasarkan data real setiap destinasi
-- Destinasi dengan harga tunggal: weekday = weekend = ticket_price
-- Destinasi dengan harga berbeda: sesuai data real

UPDATE destinations SET ticket_weekday = 10000, ticket_weekend = 10000
  WHERE name = 'Cafe Sawah';

UPDATE destinations SET ticket_weekday = 35000, ticket_weekend = 40000
  WHERE name = 'Coban Rondo';

UPDATE destinations SET ticket_weekday = 10000, ticket_weekend = 10000
  WHERE name = 'Bukit Nirwana';

UPDATE destinations SET ticket_weekday = 35000, ticket_weekend = 40000
  WHERE name = 'Bobocabin Coban Rondo';

UPDATE destinations SET ticket_weekday = 20000, ticket_weekend = 20000
  WHERE name = 'Kelinci Park';

UPDATE destinations SET ticket_weekday = 30000, ticket_weekend = 35000
  WHERE name = 'Florawisata Santerra De Laponte';

-- Verifikasi
SELECT name, ticket_price, ticket_weekday, ticket_weekend
FROM destinations ORDER BY id;
