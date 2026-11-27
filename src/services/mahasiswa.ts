import prisma from "../lib/prisma.ts";

export async function getAllCourses() {
    return await prisma.matakuliah.findMany({
        include: {
            kelas: {}
        }
    });
}

export async function getTakenCourses(npm: string) {
    return await prisma.matakuliah.findMany({
		where: {
			kelas: {
				some: {
					pengambilanMatakuliah: {
						some: {
							npm_mahasiswa: npm
						}
					}
				}
			}
		},
        include: {
            kelas: {}
        },
    });
}

export async function getStudent(userUUID: string) {
	return await prisma.mahasiswa.findUnique({
		where: {
			UUID: userUUID
		}
	})
}

export async function getAllTubesMatakuliah(npm: string) {
    const data = await prisma.tugasBesar.findMany({
        where: {
            kelas : {
                pengambilanMatakuliah : {
					some: {
						npm_mahasiswa: npm
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

export async function getProjects(npm: string) {
	return await prisma.tugasBesar.findMany({
		where: {
			kelas: {
				pengambilanMatakuliah: {
					some: {
						npm_mahasiswa: npm
					}
				}
			}
		},
		select: {
			deskripsi: true,
			kelas: {
				select: {
					dosen: {
						select: {
							pengguna: {
								
							}
						}
					}
				}
			}
		}
	})
}

export async function takeCourse(npm: string, classIds: number[]) {
	return await prisma.pengambilanMatakuliah.createMany({
		data: classIds.map((id: number) => ({
			npm_mahasiswa: npm,
			id_kelas: id
		}))
	});
}

export async function joinGroup(npm: string, groupId: number) {
	return await prisma.anggotaKelompok.create({
		data: {
			npm_mahasiswa: npm,
			id_kelompok: groupId
		}
	});
}
