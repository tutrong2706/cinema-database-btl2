import prisma from "../common/prisma/prisma.init.js";

class UserService {
    async getTransactionHistory(userId) {
        const orders = await prisma.don_hang.findMany({
            where: {
                MaNguoiDung_KH: userId
            },
            include: {
                ve_xem_phim: {
                    include: {
                        suat_chieu: {
                            include: {
                                phim: true,
                                phong_chieu: {
                                    include: {
                                        rap_chieu_phim: true
                                    }
                                }
                            }
                        },
                        ghe: true,
                        ap_dung: {
                            include: {
                                chuong_trinh_khuyen_mai: true
                            }
                        }
                    }
                },
                gom: {
                    include: {
                        mat_hang: true
                    }
                },
                thanh_toan: true
            },
            orderBy: {
                ThoiGianDat: 'desc'
            }
        });

        return orders;
    }
}

export default new UserService();
