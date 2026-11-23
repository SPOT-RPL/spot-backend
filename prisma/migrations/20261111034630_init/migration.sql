-- CreateEnum
CREATE TYPE "StatusPengguna" AS ENUM ('Aktif', 'Tidak Aktif');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Mahasiswa', 'Dosen');

-- CreateEnum
CREATE TYPE "statusTugasBesar" AS ENUM ('Pendaftaran', 'Penjadwalan', 'Presentasi', 'Selesai');

-- CreateEnum
CREATE TYPE "statusKelompok" AS ENUM ('Terbuka', 'Kurang', 'Penuh');

-- CreateEnum
CREATE TYPE "Hari" AS ENUM ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat');

-- CreateTable
CREATE TABLE "Pengguna" (
    "UUID" CHAR(36) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nama_lengkap" VARCHAR(255) NOT NULL,
    "status" "StatusPengguna" NOT NULL DEFAULT 'Aktif',
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL,

    CONSTRAINT "Pengguna_pkey" PRIMARY KEY ("UUID")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id_admin" CHAR(10) NOT NULL,
    "UUID" CHAR(36) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "Mahasiswa" (
    "npm" CHAR(10) NOT NULL,
    "UUID" CHAR(36) NOT NULL,

    CONSTRAINT "Mahasiswa_pkey" PRIMARY KEY ("npm")
);

-- CreateTable
CREATE TABLE "Dosen" (
    "nidn" CHAR(10) NOT NULL,
    "UUID" CHAR(36) NOT NULL,

    CONSTRAINT "Dosen_pkey" PRIMARY KEY ("nidn")
);

-- CreateTable
CREATE TABLE "Aktivitas" (
    "id_aktivitas" SERIAL NOT NULL,
    "userId" CHAR(36) NOT NULL,
    "jenis_aktivitas" VARCHAR(255) NOT NULL,
    "detail" VARCHAR(255) NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aktivitas_pkey" PRIMARY KEY ("id_aktivitas")
);

-- CreateTable
CREATE TABLE "Matakuliah" (
    "kode_mk" VARCHAR(255) NOT NULL,
    "nama_mk" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Matakuliah_pkey" PRIMARY KEY ("kode_mk")
);

-- CreateTable
CREATE TABLE "Kelas" (
    "id_kelas" SERIAL NOT NULL,
    "kode_mk" VARCHAR(255) NOT NULL,
    "nidn" CHAR(10) NOT NULL,
    "nama_kelas" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kelas_pkey" PRIMARY KEY ("id_kelas")
);

-- CreateTable
CREATE TABLE "TugasBesar" (
    "id_tubes" SERIAL NOT NULL,
    "id_kelas" INTEGER NOT NULL,
    "deskripsi" VARCHAR(255) NOT NULL,
    "jumlah_kel" INTEGER NOT NULL,
    "maksimal_kel" INTEGER NOT NULL,
    "pendaftaran_mulai" TIMESTAMP(3) NOT NULL,
    "pendaftaran_akhir" TIMESTAMP(3) NOT NULL,
    "statusPendaftaran" "statusTugasBesar" NOT NULL,

    CONSTRAINT "TugasBesar_pkey" PRIMARY KEY ("id_tubes")
);

-- CreateTable
CREATE TABLE "Ruangan" (
    "id_ruangan" SERIAL NOT NULL,
    "nama_ruangan" VARCHAR(255) NOT NULL,

    CONSTRAINT "Ruangan_pkey" PRIMARY KEY ("id_ruangan")
);

-- CreateTable
CREATE TABLE "Kelompok" (
    "id_kelompok" SERIAL NOT NULL,
    "id_tubes" INTEGER NOT NULL,
    "statusKelompok" "statusKelompok" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kelompok_pkey" PRIMARY KEY ("id_kelompok")
);

-- CreateTable
CREATE TABLE "jadwalPresentasi" (
    "id_jadwal" SERIAL NOT NULL,
    "id_ruangan" INTEGER NOT NULL,
    "id_kelompok" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "jam_mulai" TIME(0) NOT NULL,
    "jam_selesai" TIME(0) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jadwalPresentasi_pkey" PRIMARY KEY ("id_jadwal")
);

-- CreateTable
CREATE TABLE "AnggotaKelompok" (
    "id_kelompok" INTEGER NOT NULL,
    "npm_mahasiswa" CHAR(10) NOT NULL,

    CONSTRAINT "AnggotaKelompok_pkey" PRIMARY KEY ("id_kelompok","npm_mahasiswa")
);

-- CreateTable
CREATE TABLE "PengambilanMatakuliah" (
    "npm_mahasiswa" CHAR(10) NOT NULL,
    "kode_mk" VARCHAR(255) NOT NULL,

    CONSTRAINT "PengambilanMatakuliah_pkey" PRIMARY KEY ("npm_mahasiswa","kode_mk")
);

-- CreateTable
CREATE TABLE "jadwalKuliah" (
    "id_jadwalKuliah" SERIAL NOT NULL,
    "id_kelas" INTEGER NOT NULL,
    "id_ruangan" INTEGER NOT NULL,
    "hari" "Hari" NOT NULL,
    "jam_mulai" TIME(0) NOT NULL,
    "jam_akhir" TIME(0) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jadwalKuliah_pkey" PRIMARY KEY ("id_jadwalKuliah")
);

-- CreateTable
CREATE TABLE "jadwalUjian" (
    "id_jadwalUjian" SERIAL NOT NULL,
    "kode_mk" VARCHAR(255) NOT NULL,
    "id_ruangan" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "jam_mulai" TIME(0) NOT NULL,
    "jam_selesai" TIME(0) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jadwalUjian_pkey" PRIMARY KEY ("id_jadwalUjian")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pengguna_email_key" ON "Pengguna"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_UUID_key" ON "Admin"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa_UUID_key" ON "Mahasiswa"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "Dosen_UUID_key" ON "Dosen"("UUID");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_UUID_fkey" FOREIGN KEY ("UUID") REFERENCES "Pengguna"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mahasiswa" ADD CONSTRAINT "Mahasiswa_UUID_fkey" FOREIGN KEY ("UUID") REFERENCES "Pengguna"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dosen" ADD CONSTRAINT "Dosen_UUID_fkey" FOREIGN KEY ("UUID") REFERENCES "Pengguna"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aktivitas" ADD CONSTRAINT "Aktivitas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Pengguna"("UUID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_kode_mk_fkey" FOREIGN KEY ("kode_mk") REFERENCES "Matakuliah"("kode_mk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_nidn_fkey" FOREIGN KEY ("nidn") REFERENCES "Dosen"("nidn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TugasBesar" ADD CONSTRAINT "TugasBesar_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "Kelas"("id_kelas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelompok" ADD CONSTRAINT "Kelompok_id_tubes_fkey" FOREIGN KEY ("id_tubes") REFERENCES "TugasBesar"("id_tubes") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwalPresentasi" ADD CONSTRAINT "jadwalPresentasi_id_ruangan_fkey" FOREIGN KEY ("id_ruangan") REFERENCES "Ruangan"("id_ruangan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwalPresentasi" ADD CONSTRAINT "jadwalPresentasi_id_kelompok_fkey" FOREIGN KEY ("id_kelompok") REFERENCES "Kelompok"("id_kelompok") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnggotaKelompok" ADD CONSTRAINT "AnggotaKelompok_id_kelompok_fkey" FOREIGN KEY ("id_kelompok") REFERENCES "Kelompok"("id_kelompok") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnggotaKelompok" ADD CONSTRAINT "AnggotaKelompok_npm_mahasiswa_fkey" FOREIGN KEY ("npm_mahasiswa") REFERENCES "Mahasiswa"("npm") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengambilanMatakuliah" ADD CONSTRAINT "PengambilanMatakuliah_npm_mahasiswa_fkey" FOREIGN KEY ("npm_mahasiswa") REFERENCES "Mahasiswa"("npm") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengambilanMatakuliah" ADD CONSTRAINT "PengambilanMatakuliah_kode_mk_fkey" FOREIGN KEY ("kode_mk") REFERENCES "Matakuliah"("kode_mk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwalKuliah" ADD CONSTRAINT "jadwalKuliah_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "Kelas"("id_kelas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwalKuliah" ADD CONSTRAINT "jadwalKuliah_id_ruangan_fkey" FOREIGN KEY ("id_ruangan") REFERENCES "Ruangan"("id_ruangan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwalUjian" ADD CONSTRAINT "jadwalUjian_kode_mk_fkey" FOREIGN KEY ("kode_mk") REFERENCES "Matakuliah"("kode_mk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwalUjian" ADD CONSTRAINT "jadwalUjian_id_ruangan_fkey" FOREIGN KEY ("id_ruangan") REFERENCES "Ruangan"("id_ruangan") ON DELETE RESTRICT ON UPDATE CASCADE;
