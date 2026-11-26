import { password } from "bun";
import prisma from "../lib/prisma.ts";
import { randomBytes } from "node:crypto";
import type { StatusPengguna } from "../../generated/prisma/enums.ts";

////////////////////////////////////////// dashboard //////////////////////////////////////////
export async function getStatistikAdmin() {
    const data = {
        jumlahDosen: await prisma.dosen.count(),
        jumlahMahasiswa: await prisma.mahasiswa.count(),
        jumlahPresentasi: await prisma.jadwalPresentasi.count(),
        jumlahTugasBesar: await prisma.tugasBesar.count()
    };

    return data;
}


export async function getAktivitasTerakhir() {
    const data = await prisma.aktivitas.findMany({
        select: {
            jenis_aktivitas: true,
            waktu: true,
            detail: true,
            pengguna: {
                select: {
                    nama_lengkap: true
                }
            }
        }, orderBy: {
            waktu: "desc"
        }, take: 4
    });

    return data;
}

export async function getJadwalPresentasi() {
    const data = await prisma.jadwalPresentasi.findMany({
        select: {
            tanggal: true,
            jam_mulai: true,
            jam_selesai: true,
            kelompok: {
                select: {
                    tugasBesar: {
                        select: {
                            statusPendaftaran: true,
                            kelas: {
                                select: {
                                    nama_kelas: true,
                                    matakuliah: {
                                        select: {
                                            nama_mk: true,
                                        }
                                    }, dosen: {
                                        select: {
                                            pengguna: {
                                                select: {
                                                    nama_lengkap: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }, orderBy: {
            tanggal: "asc"
        }, take: 4
    })


    return data;
}

////////////////////////////////////////// Manajemen Akun Siswa //////////////////////////////////////////
export async function getAllAkunMahasiswa() {
    const data = await prisma.mahasiswa.findMany({
        select: {
            pengguna: {
                select: {
                    nama_lengkap: true,
                    email: true,
                    timeStamp: true,
                    status: true
                }
            }
        }
    });

    return data;
}

export async function tambahMahasiswa(nama_lengkap: string, npm: string, email: string) {
    const passwordAwal = randomBytes(12).toString("base64");

    const hashedPassword = await Bun.password.hash(passwordAwal);

    const data = await prisma.pengguna.create({
        data: {
            nama_lengkap: nama_lengkap,
            email: email,
            password: await Bun.password.hash(hashedPassword),
            role: "Mahasiswa",
            mahasiswa: {
                create: {
                    npm: npm
                }
            }
        },
        select: {
            UUID: true,
            nama_lengkap: true,
            email: true,
            mahasiswa: {
                select: {
                    npm: true
                }
            }
        }
    });

    return data;
}

export async function getMatakuliahYangDiambil(npm: string) {
    const data = await prisma.pengambilanMatakuliah.findMany({
        where: {
            npm_mahasiswa: npm
        }, select: {
            id_kelas: true,
            kelas: {
                select: {
                    nama_kelas: true,
                    matakuliah: {
                        select: {
                            nama_mk: true,
                        }
                    }
                }
            }
        }
    })
    return data;
}

export async function editMahasiswa(nama_lengkap: string, npmBaru: string, npmLama: string, email: string, statusPengguna: StatusPengguna, idKelasDihapus: number[]) {
    const deleted = await prisma.pengambilanMatakuliah.deleteMany({
        where: {
            npm_mahasiswa: npmLama,
            id_kelas: {
                in: idKelasDihapus
            }
        }
    })


    const data = await prisma.mahasiswa.update({
        where: {
            npm: npmLama,
        },
        data: {
            npm: npmBaru,
            pengguna: {
                update: {
                    nama_lengkap: nama_lengkap,
                    email: email,
                    status: statusPengguna
                }
            }
        }
    })

    return { data, deleted };
}

////////////////////////////////////////// Manajemen Akun Dosen //////////////////////////////////////////
export async function getAllAkunDosen() {
    const data = await prisma.dosen.findMany({
        select: {
            pengguna: {
                select: {
                    nama_lengkap: true,
                    email: true,
                    timeStamp: true,
                    status: true
                }
            }
        }
    });

    return data;
}

export async function tambahDosen(nama_lengkap: string, nidn: string, email: string) {
    const passwordAwal = randomBytes(12).toString("base64");

    const hashedPassword = await Bun.password.hash(passwordAwal);

    const data = await prisma.pengguna.create({
        data: {
            nama_lengkap: nama_lengkap,
            email: email,
            password: await Bun.password.hash(hashedPassword),
            role: "Dosen",
            dosen: {
                create: {
                    nidn: nidn
                }
            }
        },
        select: {
            UUID: true,
            nama_lengkap: true,
            email: true,
            dosen: {
                select: {
                    nidn: true
                }
            }
        }
    });

    return data;
}

export async function getMatakuliahYangDiajar(nidn: string) {
    const data = await prisma.kelas.findMany({
        where: {
            nidn: nidn
        }, select: {
            id_kelas: true,
            nama_kelas: true,
            matakuliah: {
                select: {
                    nama_mk: true
                }
            }
        }
    })
    return data;
}

export async function editDosen(nama_lengkap: string, nidnBaru: string, nidnLama: string, email: string, statusPengguna: StatusPengguna) {
    const data = await prisma.dosen.update({
        where: {
            nidn: nidnLama
        }, data: {
            nidn: nidnBaru,
            pengguna: {
                update: {
                    nama_lengkap: nama_lengkap,
                    email: email,
                    status: statusPengguna
                }
            }
        }
    });

    return data;
}

export async function gantiDosenPengampu(idKelas: number,nidnDosenBaru: string) {
    return await prisma.kelas.update({
        where: {
            id_kelas: idKelas
        },
        data: {
            nidn: nidnDosenBaru
        }
    });
}
////////////////////////////////////////// Manajemen Matakuliah //////////////////////////////////////////
export async function tambahMatakuliah(
    kodeMk: string,
    namaMk: string,
    namaKelas: string,
    nidn: string
) {
    const data = await prisma.matakuliah.create({
        data: {
            kode_mk: kodeMk,
            nama_mk: namaMk,
            kelas: {
                create: {
                    nama_kelas: namaKelas,
                    dosen: {
                        connect: {
                            nidn: nidn
                        }
                    }
                }
            }
        },
        include: {
            kelas: true
        }
    });

    return data;
}

export async function editMatakuliah(kodeMk: string,namaMkBaru: string,idKelas: number,namaKelasBaru: string) {
    const data = await prisma.matakuliah.update({
        where: {
            kode_mk: kodeMk
        },
        data: {
            nama_mk: namaMkBaru,
            kelas: {
                update: {
                    where: {
                        id_kelas: idKelas
                    },
                    data: {
                        nama_kelas: namaKelasBaru
                    }
                }
            }
        },
        include: {
            kelas: true
        }
    });

    return data;
}

////////////////////////////////////////// Halaman Aktivitas Pengguna //////////////////////////////////////////
export async function getAllAktivitasPengguna() {
    const data = await prisma.aktivitas.findMany({
        select: {
            id_aktivitas: true,
            jenis_aktivitas: true,
            detail: true,
            waktu: true,
            pengguna: {
                select: {
                    nama_lengkap: true,
                    email: true
                }
            }
        },
        orderBy: {
            waktu: "desc"
        }
    });

    return data;
}