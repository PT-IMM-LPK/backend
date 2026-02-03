# Backend LPK IMM

Backend API untuk sistem LPK IMM menggunakan Express.js dan Prisma ORM.

## 🛠 Tech Stack

| Technology | Description |
|------------|-------------|
| **Runtime** | Node.js |
| **Framework** | Express.js v5 |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **Authentication** | JWT (JSON Web Token) |
| **Documentation** | Swagger UI |

## 📁 Struktur Folder

```
backend/
├── prisma/
│   ├── schema.prisma       # Prisma schema
│   ├── seed.js             # Database seeder
│   └── migrations/         # Migration files
├── src/
│   ├── config/
│   │   ├── database.js     # Konfigurasi Prisma Client
│   │   └── swagger.js      # Konfigurasi Swagger
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── departemenController.js
│   │   └── penggunaController.js
│   ├── middleware/
│   │   ├── auth.js         # JWT authentication
│   │   ├── errorHandler.js # Global error handler
│   │   └── validation.js   # Input validation
│   ├── routes/
│   │   ├── auth.js
│   │   ├── departemen.js
│   │   └── pengguna.js
│   ├── utils/
│   │   └── jwt.js          # JWT utilities
│   └── server.js           # Entry point
├── .env                    # Environment variables
└── package.json
```

## 🚀 Cara Memulai

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env` di root folder backend:

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

# Seed database dengan data contoh
npm run seed
```

### 4. Jalankan Server

```bash
# Development mode (dengan hot reload)
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

**API Documentation:** `http://localhost:3000/docs`

---

## 📊 Database Schema

### Table: `departemen`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `nomor` | INT | PK, Auto Increment | ID unik departemen |
| `namaDepartemen` | VARCHAR(100) | UNIQUE, NOT NULL | Nama departemen |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Tanggal dibuat |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Tanggal terakhir diupdate |

**Contoh Data:**

| nomor | namaDepartemen |
|-------|----------------|
| 1 | IT Department |
| 2 | HR Department |
| 3 | Finance Department |
| 4 | Marketing Department |
| 5 | Operations Department |
| 6 | Sales Department |
| 7 | Logistics Department |
| 8 | Quality Assurance |

---

### Table: `pengguna`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `nomor` | INT | PK, Auto Increment | ID unik pengguna |
| `nama` | VARCHAR(100) | NOT NULL | Nama lengkap |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | Email pengguna |
| `password` | TEXT | NOT NULL | Password (bcrypt hashed) |
| `nomorTelepon` | VARCHAR(20) | NULL | Nomor telepon |
| `tanggalLahir` | DATE | NULL | Tanggal lahir |
| `role` | ENUM | DEFAULT 'KARYAWAN' | Role pengguna |
| `departemenId` | INT | FK → departemen(nomor) | ID departemen |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Tanggal dibuat |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Tanggal terakhir diupdate |

**Role ENUM Values:**

| Role | Description |
|------|-------------|
| `KARYAWAN` | Karyawan biasa |
| `SUPERVISOR` | Supervisor/Manager |
| `ADMIN` | Administrator |
| `SUPER_ADMIN` | Super Administrator |

**Contoh Data:**

| nomor | nama | email | role | departemenId |
|-------|------|-------|------|--------------|
| 1 | Super Admin | superadmin@lpkimm.com | SUPER_ADMIN | 1 |
| 2 | Admin User | admin@lpkimm.com | ADMIN | 1 |
| 3 | Supervisor HR | supervisor.hr@lpkimm.com | SUPERVISOR | 2 |
| 4 | John Doe | john.doe@lpkimm.com | KARYAWAN | 4 |

---

### Entity Relationship Diagram (ERD)

```
┌─────────────────┐         ┌─────────────────────────┐
│   departemen    │         │        pengguna         │
├─────────────────┤         ├─────────────────────────┤
│ nomor (PK)      │◄────────│ departemenId (FK)       │
│ namaDepartemen  │    1:N  │ nomor (PK)              │
│ createdAt       │         │ nama                    │
│ updatedAt       │         │ email (UNIQUE)          │
└─────────────────┘         │ password                │
                            │ nomorTelepon            │
                            │ tanggalLahir            │
                            │ role                    │
                            │ createdAt               │
                            │ updatedAt               │
                            └─────────────────────────┘
```

---

## 📡 API Endpoints

### Base URL

```
http://localhost:3000
```

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check & API info |
| GET | `/docs` | Swagger API Documentation |
| GET | `/docs.json` | Swagger JSON spec |

---

### 🔐 Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user baru | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/auth/change-password` | Ubah password | ✅ |

#### POST `/api/auth/register`

**Request Body:**
```json
{
  "nama": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "nomorTelepon": "081234567890",
  "tanggalLahir": "1990-01-15",
  "departemenId": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "nomor": 1,
      "nama": "John Doe",
      "email": "john@example.com",
      "role": "KARYAWAN",
      "departemen": {
        "nomor": 1,
        "namaDepartemen": "IT Department"
      }
    }
  }
}
```

---

#### POST `/api/auth/login`

**Request Body:**
```json
{
  "email": "admin@lpkimm.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "nomor": 2,
      "nama": "Admin User",
      "email": "admin@lpkimm.com",
      "role": "ADMIN",
      "departemen": {
        "nomor": 1,
        "namaDepartemen": "IT Department"
      }
    }
  }
}
```

---

#### GET `/api/auth/me`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "nomor": 2,
      "nama": "Admin User",
      "email": "admin@lpkimm.com",
      "role": "ADMIN",
      "departemen": {
        "nomor": 1,
        "namaDepartemen": "IT Department"
      }
    }
  }
}
```

---

#### POST `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password berhasil diubah"
}
```

---

### 🏢 Departemen Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/departemen` | Get semua departemen | ✅ |
| GET | `/api/departemen/:id` | Get departemen by ID | ✅ |
| POST | `/api/departemen` | Buat departemen baru | ✅ Admin |
| PUT | `/api/departemen/:id` | Update departemen | ✅ Admin |
| DELETE | `/api/departemen/:id` | Hapus departemen | ✅ Admin |

#### GET `/api/departemen`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "departemen": [
      {
        "nomor": 1,
        "namaDepartemen": "IT Department",
        "createdAt": "2026-01-29T07:43:02.000Z",
        "updatedAt": "2026-01-29T07:43:02.000Z",
        "_count": {
          "pengguna": 2
        }
      },
      {
        "nomor": 2,
        "namaDepartemen": "HR Department",
        "createdAt": "2026-01-29T07:43:02.000Z",
        "updatedAt": "2026-01-29T07:43:02.000Z",
        "_count": {
          "pengguna": 1
        }
      }
    ]
  }
}
```

---

#### GET `/api/departemen/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "departemen": {
      "nomor": 1,
      "namaDepartemen": "IT Department",
      "createdAt": "2026-01-29T07:43:02.000Z",
      "updatedAt": "2026-01-29T07:43:02.000Z",
      "pengguna": [
        {
          "nomor": 1,
          "nama": "Super Admin",
          "email": "superadmin@lpkimm.com",
          "role": "SUPER_ADMIN"
        },
        {
          "nomor": 2,
          "nama": "Admin User",
          "email": "admin@lpkimm.com",
          "role": "ADMIN"
        }
      ]
    }
  }
}
```

---

#### POST `/api/departemen`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "namaDepartemen": "Research Department"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Departemen berhasil dibuat",
  "data": {
    "departemen": {
      "nomor": 9,
      "namaDepartemen": "Research Department",
      "createdAt": "2026-02-03T10:00:00.000Z",
      "updatedAt": "2026-02-03T10:00:00.000Z"
    }
  }
}
```

---

#### PUT `/api/departemen/:id`

**Request Body:**
```json
{
  "namaDepartemen": "Research & Development"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Departemen berhasil diupdate",
  "data": {
    "departemen": {
      "nomor": 9,
      "namaDepartemen": "Research & Development",
      "updatedAt": "2026-02-03T10:05:00.000Z"
    }
  }
}
```

---

#### DELETE `/api/departemen/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Departemen berhasil dihapus"
}
```

---

### 👤 Pengguna Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/pengguna` | Get semua pengguna | ✅ |
| GET | `/api/pengguna/:id` | Get pengguna by ID | ✅ |
| POST | `/api/pengguna` | Buat pengguna baru | ✅ Admin |
| PUT | `/api/pengguna/:id` | Update pengguna | ✅ Admin |
| DELETE | `/api/pengguna/:id` | Hapus pengguna | ✅ Admin |

#### GET `/api/pengguna`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `role` | string | Filter by role (KARYAWAN, SUPERVISOR, ADMIN, SUPER_ADMIN) |
| `departemenId` | integer | Filter by departemen ID |
| `search` | string | Search by nama or email |

**Example:**
```
GET /api/pengguna?role=KARYAWAN&departemenId=1&search=john
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pengguna": [
      {
        "nomor": 5,
        "nama": "John Doe",
        "email": "john.doe@lpkimm.com",
        "nomorTelepon": "081234567894",
        "tanggalLahir": "1995-11-08T00:00:00.000Z",
        "role": "KARYAWAN",
        "departemen": {
          "nomor": 4,
          "namaDepartemen": "Marketing Department"
        },
        "createdAt": "2026-01-29T07:43:02.000Z"
      }
    ]
  }
}
```

---

#### GET `/api/pengguna/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pengguna": {
      "nomor": 1,
      "nama": "Super Admin",
      "email": "superadmin@lpkimm.com",
      "nomorTelepon": "081234567890",
      "tanggalLahir": "1985-01-15T00:00:00.000Z",
      "role": "SUPER_ADMIN",
      "departemen": {
        "nomor": 1,
        "namaDepartemen": "IT Department"
      },
      "createdAt": "2026-01-29T07:43:02.000Z",
      "updatedAt": "2026-01-29T07:43:02.000Z"
    }
  }
}
```

---

#### POST `/api/pengguna`

**Request Body:**
```json
{
  "nama": "New Employee",
  "email": "new.employee@lpkimm.com",
  "password": "password123",
  "nomorTelepon": "081234567899",
  "tanggalLahir": "1998-06-20",
  "departemenId": 3,
  "role": "KARYAWAN"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Pengguna berhasil dibuat",
  "data": {
    "pengguna": {
      "nomor": 9,
      "nama": "New Employee",
      "email": "new.employee@lpkimm.com",
      "nomorTelepon": "081234567899",
      "role": "KARYAWAN",
      "departemen": {
        "nomor": 3,
        "namaDepartemen": "Finance Department"
      }
    }
  }
}
```

---

#### PUT `/api/pengguna/:id`

**Request Body:**
```json
{
  "nama": "Updated Name",
  "nomorTelepon": "081999888777",
  "departemenId": 2,
  "role": "SUPERVISOR"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pengguna berhasil diupdate",
  "data": {
    "pengguna": {
      "nomor": 9,
      "nama": "Updated Name",
      "role": "SUPERVISOR",
      "departemen": {
        "nomor": 2,
        "namaDepartemen": "HR Department"
      }
    }
  }
}
```

---

#### DELETE `/api/pengguna/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Pengguna berhasil dihapus"
}
```

---

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

# Reset database
npx prisma migrate reset
```

---

## 📝 Contoh Request dengan cURL

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
    "email": "admin@lpkimm.com",
    "password": "password123"
  }'
```

### Get Protected Resource

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Departemen

```bash
curl http://localhost:3000/api/departemen \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Departemen (Admin)

```bash
curl -X POST http://localhost:3000/api/departemen \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "namaDepartemen": "New Department"
  }'
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Nama, email, dan password wajib diisi"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token tidak ditemukan. Silakan login."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke resource ini"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Endpoint tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🧪 Testing Accounts

Setelah menjalankan seed (`npm run seed`), akun berikut tersedia untuk testing:

| Email | Password | Role |
|-------|----------|------|
| superadmin@lpkimm.com | password123 | SUPER_ADMIN |
| admin@lpkimm.com | password123 | ADMIN |
| supervisor.hr@lpkimm.com | password123 | SUPERVISOR |
| supervisor.finance@lpkimm.com | password123 | SUPERVISOR |
| john.doe@lpkimm.com | password123 | KARYAWAN |
| jane.smith@lpkimm.com | password123 | KARYAWAN |

---

## 📄 License

ISC
