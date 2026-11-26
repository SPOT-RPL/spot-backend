import prisma from "../lib/prisma.ts";

export async function getAllMataKuliah() {
    return await prisma.matakuliah.findMany({
        include: {
            kelas: {}
        }
    });
}

export async function getMahasiswa(userUUID: string) {
	return await prisma.mahasiswa.findUnique({
		where: {
			UUID: userUUID
		}
	})
}

export async function getMatakuliahYangDiambil(npm: string) {
    return await prisma.pengambilanMatakuliah.findMany({
        where: {
            npm_mahasiswa: npm
        },
        include: {
            kelas: {
                include: {
                    matakuliah: true
                }
            }
        }
    })
}

export async function simpanMatakuliah(npm: string, idKelas: number[]) {
    return await prisma.pengambilanMatakuliah.createMany({
        data: idKelas.map(id => ({
            npm_mahasiswa: npm,
            id_kelas: id
        })),
        skipDuplicates: true
    });
}

export async function getKelasMatakuliah(namaMatakuliah: string) {
    const data = await prisma.kelas.findMany({
        where: {
            kode_mk: namaMatakuliah,
        },
        include: {
            matakuliah: true,
        }
    });

    return data;
}

export async function getKelompok(namaMatakuliah: string, namaKelas: string) {
    const data = await prisma.kelompok.findMany({
        where: {
            tugasBesar: {
                kelas: {
                    nama_kelas: namaKelas,
                    matakuliah: {
                        nama_mk: namaMatakuliah
                    },
                },
            },
        },
        include: {
            tugasBesar: {
                include: {
                    kelas: {
                        include: {
                            matakuliah: true,
                            dosen : {
                                include : {
                                    pengguna : {
                                        select : {
                                            nama_lengkap : true
                                        },
                                    },
                                },
                            },
                        }, 
                    },
                }, 
            },anggotaKelompok : {
                include : {
                    mahasiswa : {
                        include : {
                            pengguna : {
                                select : {
                                    nama_lengkap : true
                                }
                            }
                        }
                    }
                }
            }, jadwalPresentasi : true
        },
    });

    return data;
}

export async function getAnggotaKelompok(idKelompok: number) {
    const data = await prisma.anggotaKelompok.findMany({
        where: {
            kelompok: {
                id_kelompok: idKelompok,
            },
        },
        include: {
            mahasiswa : {
                include : {
                    pengguna : {
                        select : {
                            nama_lengkap : true
                        }
                    }
                }
            }
        }
    });
    return data;
}

export async function gabungKelompok (npm : string, idKelompok : number){
    return await prisma.anggotaKelompok.create({
        data : {
            npm_mahasiswa : npm,
            id_kelompok : idKelompok
        }
    });
}

export async function getJadwalMatakuliahMahasiswa(npm: string) {
    const data = await prisma.pengambilanMatakuliah.findMany({
        where: {
            npm_mahasiswa: npm,
        },
        include: {
            kelas: {
                include: {
                    matakuliah: true,
                    dosen : {
                        include : {
                            pengguna : {
                                select : {
                                    nama_lengkap : true
                                }
                            }
                        },
                    }, jadwalKuliah : {
                        include : {
                            ruangan : true
                        }
                    } 
                },
            },
        },
    });

    return data;
}

export async function getJadwalUjianMahasiswa(npm: string) {
    console.log("Testing")
    const data = await prisma.jadwalUjian.findMany({
        where: {
            matakuliah: {
                kelas: {
                    some: {
                        pengambilanMatakuliah: {
                            some: {
                                npm_mahasiswa: npm
                            },
                        },
                    },
                },
            },
        }, include: {
            matakuliah: {
                include : {
                    kelas : {
                        where : {
                            pengambilanMatakuliah : {
                                some : {
                                    npm_mahasiswa : npm
                                }
                            }
                        }, select : {
                            nama_kelas : true
                        }
                    }
                }
            }, ruangan : true
        }, orderBy: [
            { tanggal: "asc" }, { jam_mulai: "asc" }
        ]
    });

    return data;
}

export async function getAllTubesMatakuliah(npm: string) {
    const data = await prisma.tugasBesar.findMany({
        where: {
            kelas : {
                pengambilanMatakuliah : {
                    some : {
                        npm_mahasiswa : npm
                    }
                }
            }
        }, include : {
            kelas : {
                include : {
                    matakuliah : true,
                    dosen : {
                        include : {
                            pengguna : {
                                select : {
                                    nama_lengkap : true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return data;
}

export async function getClassSchedule(npm: string) {
	return await prisma.pengambilanMatakuliah.findMany({
		where: {
			npm_mahasiswa: npm
		},
		select: {
			kelas: {
				select: {
					matakuliah: true,
					nama_kelas: true,
					dosen: {
						select: {
							pengguna: {
								select: {
									nama_lengkap: true
								}
							}
						}
					},
					jadwalKuliah: true
				}
			}
		}
	})
}

export async function getExamSchedule(npm: string) {
	return await prisma.pengambilanMatakuliah.findMany({
		where: {
			npm_mahasiswa: npm
		},
		select: {
			kelas: {
				select: {
					matakuliah: {
						select: {
							nama_mk: true,
							jadwalUjian: true
						}
					}
				}
			}
		}
	})
}
