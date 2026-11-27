
import {
    Role,
    statusKelompok,
    StatusPengguna,
    statusTugasBesar,
    Hari
} from "../generated/prisma/enums.ts";

import prisma from "../src/lib/prisma.ts";

async function main() {

    // ========================================
    // 1. MATA KULIAH
    // ========================================

    const matakuliah = [
        { kode_mk: "IF101", nama_mk: "Rekayasa Perangkat Lunak" },
        { kode_mk: "IF102", nama_mk: "Basis Data" },
        { kode_mk: "IF103", nama_mk: "Pemrograman Berbasis Web" },
        { kode_mk: "IF104", nama_mk: "Keamanan Informasi" },
        { kode_mk: "IF105", nama_mk: "Sistem Operasi" }
    ];

    await prisma.matakuliah.createMany({
        data: matakuliah,
        skipDuplicates: true
    });


    // ========================================
    // 2. PENGGUNA
    // ========================================

    const pengguna = [
        {
            email: "johndoe@gmail.com",
            password: "john",
            nama_lengkap: "John Doe",
            status: StatusPengguna.Aktif,
            timeStamp: new Date(),
            role: Role.Admin
        },
        {
            email: "kumara@gmail.com",
            password: "kumara",
            nama_lengkap: "Kumara Ivan",
            status: StatusPengguna.Aktif,
            timeStamp: new Date(),
            role: Role.Student
        },
        {
            email: "farrel@gmail.com",
            password: "farrel",
            nama_lengkap: "Muhammad Farrel Putra Rifani",
            status: StatusPengguna.Aktif,
            timeStamp: new Date(),
            role: Role.Student
        },
        {
            email: "andra@gmail.com",
            password: "andra",
            nama_lengkap: "Efrem Andra Winata",
            status: StatusPengguna.Aktif,
            timeStamp: new Date(),
            role: Role.Student
        },
        {
            email: "MrBig@gmail.com",
            password: "big",
            nama_lengkap: "Mr Big",
            status: StatusPengguna.Aktif,
            timeStamp: new Date(),
            role: Role.Lecturer
        },
        {
            email: "MrGood@gmail.com",
            password: "good",
            nama_lengkap: "Mr Good",
            status: StatusPengguna.Aktif,
            timeStamp: new Date(),
            role: Role.Lecturer
        }
    ];

    await prisma.pengguna.createMany({
        data: pengguna,
        skipDuplicates: true
    });


    // ========================================
    // 3. Student
    // ========================================

    const Student = [
        { npm: "6182401018", email: "kumara@gmail.com" },
        { npm: "6182401025", email: "farrel@gmail.com" },
        { npm: "6182401019", email: "andra@gmail.com" }
    ];

    for (const m of Student) {
        await prisma.student.upsert({
            where: {
                npm: m.npm
            },
            update: {},
            create: {
                npm: m.npm,
                pengguna: {
                    connect: {
                        email: m.email
                    }
                }
            }
        });
    }


    // ========================================
    // 4. ADMIN
    // ========================================

    await prisma.admin.upsert({
        where: {
            id_admin: "admin_01"
        },
        update: {},
        create: {
            id_admin: "admin_01",
            pengguna: {
                connect: {
                    email: "johndoe@gmail.com"
                }
            }
        }
    });


    // ========================================
    // 5. Lecturer
    // ========================================

    const Lecturer = [
        { nidn: "2000618001", email: "MrBig@gmail.com" },
        { nidn: "2000618002", email: "MrGood@gmail.com" }
    ];

    for (const d of Lecturer) {
        await prisma.lecturer.upsert({
            where: {
                nidn: d.nidn
            },
            update: {},
            create: {
                nidn: d.nidn,
                pengguna: {
                    connect: {
                        email: d.email
                    }
                }
            }
        });
    }


    // ========================================
    // 6. KELAS
    // ========================================

    const kelas = [
        { kode_mk: "IF101", nama_kelas: "A", nidn: "2000618001" },
        { kode_mk: "IF101", nama_kelas: "B", nidn: "2000618002" },
        { kode_mk: "IF102", nama_kelas: "A", nidn: "2000618001" },
        { kode_mk: "IF102", nama_kelas: "B", nidn: "2000618002" },
        { kode_mk: "IF103", nama_kelas: "A", nidn: "2000618001" },
        { kode_mk: "IF104", nama_kelas: "A", nidn: "2000618002" },
        { kode_mk: "IF105", nama_kelas: "A", nidn: "2000618001" }
    ];

    for (const k of kelas) {
        const existing = await prisma.kelas.findFirst({
            where: {
                kode_mk: k.kode_mk,
                nama_kelas: k.nama_kelas
            }
        });

        if (!existing) {
            await prisma.kelas.create({
                data: {
                    kode_mk: k.kode_mk,
                    nama_kelas: k.nama_kelas,
                    nidn: k.nidn
                }
            });
        }
    }


    // ========================================
    // 7. PENGAMBILAN MATA KULIAH
    // ========================================

    const pengambilanMatakuliah = [
        { npm: "6182401018", kode_mk: "IF101", nama_kelas: "A" },
        { npm: "6182401018", kode_mk: "IF102", nama_kelas: "B" },
        { npm: "6182401018", kode_mk: "IF103", nama_kelas: "A" },

        { npm: "6182401025", kode_mk: "IF101", nama_kelas: "A" },
        { npm: "6182401025", kode_mk: "IF103", nama_kelas: "A" },

        { npm: "6182401019", kode_mk: "IF101", nama_kelas: "B" },
        { npm: "6182401019", kode_mk: "IF104", nama_kelas: "A" }
    ];

    for (const p of pengambilanMatakuliah) {
        const kelas = await prisma.kelas.findFirstOrThrow({
            where: {
                kode_mk: p.kode_mk,
                nama_kelas: p.nama_kelas
            }
        });

        await prisma.pengambilanMatakuliah.createMany({
            data: [{
                npm_mahasiswa: p.npm,
                id_kelas: kelas.id_kelas
            }],
            skipDuplicates: true
        });
    }


    // ========================================
    // 8. TUGAS BESAR
    // ========================================

    const tubes = [
        {
            kode_mk: "IF101",
            nama_kelas: "A",
            deskripsi: "Membuat aplikasi berbasis web",
            jumlah_kel: 5,
            maksimal_kel: 4,
            statusPendaftaran: statusTugasBesar.Pendaftaran
        },
        {
            kode_mk: "IF101",
            nama_kelas: "B",
            deskripsi: "Membuat sistem database",
            jumlah_kel: 4,
            maksimal_kel: 5,
            statusPendaftaran: statusTugasBesar.Pendaftaran
        }
    ];

    for (const t of tubes) {
        const kelas = await prisma.kelas.findFirstOrThrow({
            where: {
                kode_mk: t.kode_mk,
                nama_kelas: t.nama_kelas
            }
        });

        const existing = await prisma.tugasBesar.findFirst({
            where: {
                id_kelas: kelas.id_kelas
            }
        });

        if (!existing) {
            await prisma.tugasBesar.create({
                data: {
                    id_kelas: kelas.id_kelas,
                    deskripsi: t.deskripsi,
                    jumlah_kel: t.jumlah_kel,
                    maksimal_kel: t.maksimal_kel,
                    pendaftaran_mulai: new Date("2026-11-25"),
                    pendaftaran_akhir: new Date("2026-12-10"),
                    statusPendaftaran: t.statusPendaftaran
                }
            });
        }
    }


    // ========================================
    // 9. KELOMPOK
    // ========================================

    const kelompok = [
        {
            kode_mk: "IF101",
            nama_kelas: "A",
            statusKelompok: statusKelompok.Terbuka
        },
        {
            kode_mk: "IF101",
            nama_kelas: "B",
            statusKelompok: statusKelompok.Terbuka
        }
    ];

    for (const k of kelompok) {
        const kelas = await prisma.kelas.findFirstOrThrow({
            where: {
                kode_mk: k.kode_mk,
                nama_kelas: k.nama_kelas
            }
        });

        const tubes = await prisma.tugasBesar.findFirstOrThrow({
            where: {
                id_kelas: kelas.id_kelas
            }
        });

        const jumlahAda = await prisma.kelompok.count({
            where: {
                id_tubes: tubes.id_tubes
            }
        });

        for (let i = jumlahAda; i < tubes.jumlah_kel; i++) {
            await prisma.kelompok.create({
                data: {
                    statusKelompok: k.statusKelompok,
                    timestamp: new Date(),
                    tugasBesar: {
                        connect: {
                            id_tubes: tubes.id_tubes
                        }
                    }
                }
            });
        }
    }


    // ========================================
    // 10. ANGGOTA KELOMPOK
    // ========================================

    const anggotaKelompok = [
        {
            kode_mk: "IF101",
            nama_kelas: "A",
            npm: [
                ["6182401018", "6182401025"]
            ]
        },
        {
            kode_mk: "IF101",
            nama_kelas: "B",
            npm: [
                ["6182401019"]
            ]
        }
    ];

    for (const anggota of anggotaKelompok) {
        const kelas = await prisma.kelas.findFirstOrThrow({
            where: {
                kode_mk: anggota.kode_mk,
                nama_kelas: anggota.nama_kelas
            }
        });

        const tubes = await prisma.tugasBesar.findFirstOrThrow({
            where: {
                id_kelas: kelas.id_kelas
            }
        });

        const kelompok = await prisma.kelompok.findMany({
            where: {
                id_tubes: tubes.id_tubes
            },
            orderBy: {
                id_kelompok: "asc"
            }
        });

        for (const [index, daftarNpm] of anggota.npm.entries()) {
            const k = kelompok[index];

            if (!k) {
                throw new Error("Kelompok tidak ditemukan");
            }

            await prisma.anggotaKelompok.createMany({
                data: daftarNpm.map(npm => ({
                    id_kelompok: k.id_kelompok,
                    npm_mahasiswa: npm
                })),
                skipDuplicates: true
            });
        }
    }


    // ========================================
    // 11. RUANGAN
    // ========================================

    const ruangan = [
        { nama_ruangan: "Lab Komputer 1" },
        { nama_ruangan: "Ruang 202" },
        { nama_ruangan: "Ruang 203" }
    ];

    for (const r of ruangan) {
        const existing = await prisma.ruangan.findFirst({
            where: {
                nama_ruangan: r.nama_ruangan
            }
        });

        if (!existing) {
            await prisma.ruangan.create({
                data: r
            });
        }
    }


    // ========================================
    // 12. HELPER TANGGAL DAN JAM
    // ========================================

    const waktu = (jam: string) =>
        new Date(`1970-01-01T${jam}:00.000Z`);

    const tanggal = (tgl: string) =>
        new Date(`${tgl}T00:00:00.000Z`);


    // ========================================
    // 13. JADWAL KULIAH
    // ========================================

    const jadwalKuliah = [
        {
            kode_mk: "IF101",
            nama_kelas: "A",
            ruangan: "Lab Komputer 1",
            hari: Hari.Senin,
            mulai: "08:00",
            akhir: "10:00"
        },
        {
            kode_mk: "IF102",
            nama_kelas: "B",
            ruangan: "Ruang 202",
            hari: Hari.Selasa,
            mulai: "10:00",
            akhir: "12:00"
        },
        {
            kode_mk: "IF103",
            nama_kelas: "A",
            ruangan: "Ruang 203",
            hari: Hari.Rabu,
            mulai: "08:00",
            akhir: "10:00"
        }
    ];

    for (const j of jadwalKuliah) {
        const kelas = await prisma.kelas.findFirstOrThrow({
            where: {
                kode_mk: j.kode_mk,
                nama_kelas: j.nama_kelas
            }
        });

        const ruangan = await prisma.ruangan.findFirstOrThrow({
            where: {
                nama_ruangan: j.ruangan
            }
        });

        const existing = await prisma.jadwalKuliah.findFirst({
            where: {
                id_kelas: kelas.id_kelas,
                hari: j.hari,
                jam_mulai: waktu(j.mulai)
            }
        });

        if (!existing) {
            await prisma.jadwalKuliah.create({
                data: {
                    id_kelas: kelas.id_kelas,
                    id_ruangan: ruangan.id_ruangan,
                    hari: j.hari,
                    jam_mulai: waktu(j.mulai),
                    jam_akhir: waktu(j.akhir)
                }
            });
        }
    }


    // ========================================
    // 14. JADWAL UJIAN
    // ========================================

    const jadwalUjian = [
        {
            kode_mk: "IF101",
            ruangan: "Lab Komputer 1",
            tanggal: "2026-12-15",
            mulai: "08:00",
            selesai: "10:00"
        },
        {
            kode_mk: "IF102",
            ruangan: "Ruang 202",
            tanggal: "2026-12-16",
            mulai: "10:00",
            selesai: "12:00"
        },
        {
            kode_mk: "IF103",
            ruangan: "Ruang 203",
            tanggal: "2026-12-17",
            mulai: "08:00",
            selesai: "10:00"
        }
    ];

    for (const j of jadwalUjian) {
        const ruangan = await prisma.ruangan.findFirstOrThrow({
            where: {
                nama_ruangan: j.ruangan
            }
        });

        const existing = await prisma.jadwalUjian.findFirst({
            where: {
                kode_mk: j.kode_mk,
                tanggal: tanggal(j.tanggal),
                jam_mulai: waktu(j.mulai)
            }
        });

        if (!existing) {
            await prisma.jadwalUjian.create({
                data: {
                    kode_mk: j.kode_mk,
                    id_ruangan: ruangan.id_ruangan,
                    tanggal: tanggal(j.tanggal),
                    jam_mulai: waktu(j.mulai),
                    jam_selesai: waktu(j.selesai)
                }
            });
        }
    }


    // ========================================
    // 15. JADWAL PRESENTASI
    // ========================================

    const jadwalPresentasi = [
        {
            kode_mk: "IF101",
            nama_kelas: "A",
            ruangan: "Lab Komputer 1",
            tanggal: "2026-12-18",
            mulai: "09:00",
            selesai: "09:20"
        },
        {
            kode_mk: "IF101",
            nama_kelas: "B",
            ruangan: "Ruang 202",
            tanggal: "2026-12-19",
            mulai: "10:00",
            selesai: "10:20"
        }
    ];

    for (const j of jadwalPresentasi) {
        const kelas = await prisma.kelas.findFirstOrThrow({
            where: {
                kode_mk: j.kode_mk,
                nama_kelas: j.nama_kelas
            }
        });

        const tubes = await prisma.tugasBesar.findFirstOrThrow({
            where: {
                id_kelas: kelas.id_kelas
            }
        });

        const kelompok = await prisma.kelompok.findFirstOrThrow({
            where: {
                id_tubes: tubes.id_tubes
            },
            orderBy: {
                id_kelompok: "asc"
            }
        });

        const ruangan = await prisma.ruangan.findFirstOrThrow({
            where: {
                nama_ruangan: j.ruangan
            }
        });

        const existing = await prisma.jadwalPresentasi.findFirst({
            where: {
                id_kelompok: kelompok.id_kelompok,
                tanggal: tanggal(j.tanggal),
                jam_mulai: waktu(j.mulai)
            }
        });

        if (!existing) {
            await prisma.jadwalPresentasi.create({
                data: {
                    id_kelompok: kelompok.id_kelompok,
                    id_ruangan: ruangan.id_ruangan,
                    tanggal: tanggal(j.tanggal),
                    jam_mulai: waktu(j.mulai),
                    jam_selesai: waktu(j.selesai)
                }
            });
        }
    }


    // ========================================
    // 16. AKTIVITAS
    // ========================================

    const aktivitas = [
        {
            email: "kumara@gmail.com",
            jenis_aktivitas: "Pengambilan Mata Kuliah",
            detail: "Mengambil IF101 Kelas A"
        },
        {
            email: "farrel@gmail.com",
            jenis_aktivitas: "Bergabung Kelompok",
            detail: "Bergabung dengan kelompok IF101 Kelas A"
        }
    ];

    for (const a of aktivitas) {
        const pengguna = await prisma.pengguna.findUniqueOrThrow({
            where: {
                email: a.email
            }
        });

        const existing = await prisma.aktivitas.findFirst({
            where: {
                userId: pengguna.UUID,
                jenis_aktivitas: a.jenis_aktivitas,
                detail: a.detail
            }
        });

        if (!existing) {
            await prisma.aktivitas.create({
                data: {
                    userId: pengguna.UUID,
                    jenis_aktivitas: a.jenis_aktivitas,
                    detail: a.detail
                }
            });
        }
    }

    console.log("Dummy data SPOT berhasil ditambahkan!");
}


// ========================================
// EKSEKUSI SEED
// ========================================

try {
    await main();
} catch (error) {
    console.error("Gagal mengisi dummy data:", error);
    process.exitCode = 1;
} finally {
    await prisma.$disconnect();
}
