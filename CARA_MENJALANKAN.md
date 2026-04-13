# Cara Menjalankan Pujon Kidul Explore

## Yang Harus Diinstall (lakukan sekali saja)

### 1. Visual Studio Code (editor kode)
- Download: https://code.visualstudio.com/download (pilih "Windows")
- Klik Next terus sampai selesai
- Extension yang direkomendasikan (install dari dalam VS Code):
  - **Go** (by Google)
  - **ESLint**
  - **Tailwind CSS IntelliSense**

### 2. Git
- Download: https://git-scm.com/download/win
- Klik Next terus sampai selesai

### 3. Go
- Download: https://go.dev/dl/ (pilih yang "go1.xx.windows-amd64.msi")
- Klik Next terus sampai selesai

### 4. Node.js
- Download: https://nodejs.org (pilih tombol "LTS")
- Klik Next terus sampai selesai

### 5. PostgreSQL
- Download: https://www.postgresql.org/download/windows/
- Klik Next terus, **catat password yang diisi** (akan dipakai nanti)
- Port biarkan default: 5432

---

## Setup Awal (lakukan sekali saja)

Buka **Terminal di VS Code** (menu Terminal → New Terminal), lalu jalankan satu per satu:

```
git clone https://github.com/taniacahya89/pujonkidul-web.git
cd pujonkidul-web
```

### Setup Database
Ganti `PASSWORD_KAMU` dengan password PostgreSQL yang tadi dicatat:
```
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE pujon_kidul_explore;"
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d pujon_kidul_explore -f backend/migrations/001_init.sql
```

### Buat file konfigurasi backend
Buat file baru bernama `.env` di dalam folder `backend`, isinya:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=PASSWORD_KAMU
DB_NAME=pujon_kidul_explore
PORT=8080
OWM_API_KEY=
ALLOWED_ORIGINS=http://localhost:5173
BBM_PRICE=10000
PUJON_LAT=-7.9285
PUJON_LON=112.4012
```

---

## Menjalankan Aplikasi

Buka **2 terminal di VS Code** secara bersamaan (klik ikon `+` di panel terminal).

### Jendela 1 — Backend
```
cd pujonkidul-web\backend
go run cmd/main.go
```
Tunggu sampai muncul tulisan `Fiber v2.x.x` — berarti backend sudah jalan.

### Jendela 2 — Frontend
(pertama kali saja, jalankan `npm install` dulu)
```
cd pujonkidul-web\frontend
npm install
npm run dev
```

### Buka di Browser
Setelah keduanya jalan, buka: **http://localhost:5173**
