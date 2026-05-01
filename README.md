# Sistem Inventaris Toko/Gudang
**UTS Pembangunan Perangkat Lunak Berorientasi Service**

- Nama: Melva Fereyzha Kirana Myko Putri
- NIM: 2410511165
- Kelas: B

## Cara Menjalankan
(akan diisi setelah semua service selesai)

## Peta Endpoint

### Auth Service (port 3001)
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET  /auth/profile
- GET  /auth/oauth/github
- GET  /auth/oauth/github/callback

### Inventory Service (port 8080)
- GET/POST       /items
- GET/PUT/DELETE /items/:id
- GET/POST       /suppliers
- GET/PUT/DELETE /suppliers/:id
- GET/POST       /locations
- GET/PUT/DELETE /locations/:id
- GET/POST       /stock-movements
- DELETE         /stock-movements/:id

### Report Service (port 3003)
- GET /reports/stock

## Demo Video
(akan diisi setelah selesai)

## Stack Teknologi
- **Auth Service:** Node.js + Express + JWT
- **Inventory Service:** PHP CodeIgniter 4 + MySQL
- **Report Service:** Node.js + Express
- **API Gateway:** Node.js + Express (http-proxy-middleware)
- **OAuth:** GitHub OAuth 2.0