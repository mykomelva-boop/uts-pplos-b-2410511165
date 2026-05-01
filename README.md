# Sistem Inventaris Toko/Gudang dengan GitHub OAuth 2.0

> UTS Pembangunan Perangkat Lunak Berorientasi Service — Kelas B

## Identitas

**Nama** : Melva Fereyzha Kirana Myko Putri

**NIM** : 2410511165

**Program Studi / Kelas** : S1 Informatika / B

**Mata Kuliah** : Pembangunan Perangkat Lunak Orientasi Servis - UTS

## Cara Menjalankan

### Prasyarat
- Node.js v18+
- PHP 8.x + Composer
- XAMPP (MySQL)

### 1. Clone Repository
```bash
git clone https://github.com/mykomelva-boop/uts-pplos-b-2410511165.git
cd uts-pplos-b-2410511165
```

### 2. Setup Database
Buka phpMyAdmin dan jalankan SQL berikut:

```sql
CREATE DATABASE inventory_db;
USE inventory_db;

CREATE TABLE suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  unit VARCHAR(20) NOT NULL,
  supplier_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE stock_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  location_id INT NOT NULL,
  type ENUM('in', 'out') NOT NULL,
  quantity INT NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
);
```

### 3. Jalankan Semua Service

```bash
# Terminal 1 - Auth Service
cd services/auth-service && npm install && npm run dev

# Terminal 2 - Inventory Service
cd services/inventory-service && php spark serve --port 8080

# Terminal 3 - Report Service
cd services/report-service && npm install && npm run dev

# Terminal 4 - API Gateway
cd gateway && npm install && npm run dev
```

---

## Peta Routing Gateway

| Path Gateway | Service Tujuan | Port |
|---|---|---|
| /api/auth/** | auth-service | 3001 |
| /api/inventory/** | inventory-service | 8080 |
| /api/reports/** | report-service | 3003 |

---

## Peta Endpoint

### Auth Service (`/auth`)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/auth/register` | Registrasi user baru | ❌ |
| POST | `/auth/login` | Login dengan email & password | ❌ |
| POST | `/auth/refresh` | Refresh access token | ❌ |
| POST | `/auth/logout` | Logout & blacklist token | ✅ |
| GET | `/auth/profile` | Lihat profil user | ✅ |
| GET | `/auth/oauth/github` | Login dengan GitHub OAuth | ❌ |

### Inventory Service (`/inventory`)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/items?page=1&per_page=10` | List semua item dengan paging | ✅ |
| POST | `/items` | Tambah item baru | ✅ |
| GET | `/suppliers` | List semua supplier | ✅ |
| POST | `/suppliers` | Tambah supplier baru | ✅ |
| GET | `/locations` | List semua lokasi gudang | ✅ |
| POST | `/locations` | Tambah lokasi baru | ✅ |
| GET | `/stock-movements` | List pergerakan stok | ✅ |
| POST | `/stock-movements` | Catat pergerakan stok masuk/keluar | ✅ |

### Report Service (`/reports`)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/reports/stock` | Laporan summary pergerakan stok | ✅ |

> ✅ = Butuh Authorization header: `Bearer <access_token>`
> ❌ = Tidak butuh token

---

## Stack Teknologi
- **Auth Service:** Node.js + Express + JWT + GitHub OAuth 2.0
- **Inventory Service:** PHP CodeIgniter 4 + MySQL
- **Report Service:** Node.js + Express
- **API Gateway:** Node.js + Express (http-proxy-middleware)

---

## Demo Video
> Link akan diupdate setelah video diunggah ke YouTube