# Backend LPK IMM

Backend API untuk sistem LPK IMM menggunakan Express.js dan Prisma ORM.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Token)

## 📁 Struktur Folder

```
backend/
├── prisma/
│   └── schema.prisma    # Prisma schema
├── src/
│   ├── config/
│   │   └── database.js  # Konfigurasi Prisma Client
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── departemenController.js
│   │   └── penggunaController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── departemen.js
│   │   └── pengguna.js
│   ├── utils/
│   │   └── jwt.js
│   └── server.js        # Entry point
├── .env                 # Environment variables
└── package.json
```

## 🚀 Cara Memulai

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env` di root folder backend (jika belum ada):

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/lpk_imm?schema=public"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d

# Frontend URL (untuk CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database (development)
npx prisma db push

# Atau gunakan migration (production)
npx prisma migrate dev --name init
```

### 4. Jalankan Server

```bash
# Development mode (dengan hot reload)
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📡 API Endpoints

### Auth

| Method | Endpoint                    | Description        | Auth |
| ------ | --------------------------- | ------------------ | ---- |
| POST   | `/api/auth/register`        | Register user baru | ❌   |
| POST   | `/api/auth/login`           | Login              | ❌   |
| GET    | `/api/auth/me`              | Get current user   | ✅   |
| POST   | `/api/auth/change-password` | Ubah password      | ✅   |

### Departemen

| Method | Endpoint              | Description          | Auth     |
| ------ | --------------------- | -------------------- | -------- |
| GET    | `/api/departemen`     | Get semua departemen | ✅       |
| GET    | `/api/departemen/:id` | Get departemen by ID | ✅       |
| POST   | `/api/departemen`     | Buat departemen baru | ✅ Admin |
| PUT    | `/api/departemen/:id` | Update departemen    | ✅ Admin |
| DELETE | `/api/departemen/:id` | Hapus departemen     | ✅ Admin |

### Pengguna

| Method | Endpoint            | Description        | Auth     |
| ------ | ------------------- | ------------------ | -------- |
| GET    | `/api/pengguna`     | Get semua pengguna | ✅       |
| GET    | `/api/pengguna/:id` | Get pengguna by ID | ✅       |
| POST   | `/api/pengguna`     | Buat pengguna baru | ✅ Admin |
| PUT    | `/api/pengguna/:id` | Update pengguna    | ✅ Admin |
| DELETE | `/api/pengguna/:id` | Hapus pengguna     | ✅ Admin |

## 🔧 Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database (tanpa migration)
npx prisma db push

# Buat migration baru
npx prisma migrate dev --name nama_migration

# Deploy migration ke production
npx prisma migrate deploy

# Buka Prisma Studio (GUI database)
npx prisma studio

# Format schema file
npx prisma format
```

## 📝 Contoh Request

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Protected Resource

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
