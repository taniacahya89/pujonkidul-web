package database

import (
	"fmt"
	"log"

	"pujon-kidul-explore/backend/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Connect membuka koneksi ke database PostgreSQL menggunakan GORM
// Parameter cfg berisi konfigurasi koneksi dari environment variable
// Mengembalikan instance *gorm.DB yang siap digunakan
func Connect(cfg *config.Config) (*gorm.DB, error) {
	// Konfigurasi logger GORM (tampilkan query di mode development)
	gormLogger := logger.Default.LogMode(logger.Info)

	// Buka koneksi ke PostgreSQL
	db, err := gorm.Open(postgres.Open(cfg.DSN()), &gorm.Config{
		Logger: gormLogger,
	})
	if err != nil {
		return nil, fmt.Errorf("gagal membuka koneksi database: %w", err)
	}

	// Konfigurasi connection pool
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("gagal mendapatkan sql.DB: %w", err)
	}

	// Maksimal 10 koneksi idle dan 100 koneksi aktif
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)

	// Verifikasi koneksi berhasil
	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("gagal ping database: %w", err)
	}

	log.Println("[DATABASE] Koneksi ke PostgreSQL berhasil")
	return db, nil
}
