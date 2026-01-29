## Backend website Layanan Permintaan Kendaraan.

Berisi Backend Express JS
Datbase Postgresql
ORM Prisma

## Command Prisma yang Sering Digunakan

### Generate Prisma Client (setelah ubah schema)

npx prisma generate

### Format schema

npx prisma format

### Validate schema

npx prisma validate

### Create migration

npx prisma migrate dev --name nama_migrasi

### Apply pending migrations

npx prisma migrate deploy

### Reset database (HATI-HATI: hapus semua data!)

npx prisma migrate reset

### Open Prisma Studio

npx prisma studio

### Pull schema from existing database

npx prisma db pull

### Push schema to database without migration

npx prisma db push
