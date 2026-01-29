-- CreateEnum
CREATE TYPE "Role" AS ENUM ('KARYAWAN', 'SUPERVISOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "departemen" (
    "nomor" SERIAL NOT NULL,
    "namaDepartemen" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departemen_pkey" PRIMARY KEY ("nomor")
);

-- CreateTable
CREATE TABLE "pengguna" (
    "nomor" SERIAL NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "nomorTelepon" VARCHAR(20),
    "email" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'KARYAWAN',
    "departemenId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("nomor")
);

-- CreateIndex
CREATE UNIQUE INDEX "departemen_namaDepartemen_key" ON "departemen"("namaDepartemen");

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_email_key" ON "pengguna"("email");

-- AddForeignKey
ALTER TABLE "pengguna" ADD CONSTRAINT "pengguna_departemenId_fkey" FOREIGN KEY ("departemenId") REFERENCES "departemen"("nomor") ON DELETE SET NULL ON UPDATE CASCADE;
