import prisma from "../common/prisma/prisma.init.js";
import { BadRequestError } from "../helpers/handleError.js";

class AdminService {
    // 1. Tìm kiếm phim (Gọi SP_TimKiemPhim)
    async getPhims(keyword) {
        const search = (keyword || "").trim();

        // Nếu không truyền keyword -> trả về toàn bộ phim kèm điểm đánh giá trung bình
        if (!search) {
            const phims = await prisma.$queryRaw`
                SELECT p.MaPhim, p.TenPhim, p.ThoiLuong, p.NgonNgu, p.QuocGia,
                       p.DaoDien, p.DienVienChinh, p.NgayKhoiChieu, p.MoTaNoiDung AS MoTaNoiDung,
                       p.DoTuoi, p.ChuDePhim, p.Anh,
                       ROUND(AVG(d.DiemSo),1) AS DiemDanhGia,
                       FUNC_DanhGiaHieuQuaPhim(p.MaPhim) AS HieuQua,
                       FUNC_DanhGiaHieuQuaPhim_Moi(p.MaPhim) AS HieuQuaMoi
                FROM PHIM p
                LEFT JOIN DANH_GIA d ON p.MaPhim = d.MaPhim
                GROUP BY p.MaPhim
                ORDER BY p.NgayKhoiChieu DESC
            `;
            return phims;
        }

        // Nếu có keyword -> query tay thay vì gọi SP
        const searchPattern = `%${search}%`;
        const phims = await prisma.$queryRaw`
            SELECT p.MaPhim, p.TenPhim, p.ThoiLuong, p.NgonNgu, p.QuocGia,
                   p.DaoDien, p.DienVienChinh, p.NgayKhoiChieu, p.MoTaNoiDung AS MoTaNoiDung,
                   p.DoTuoi, p.ChuDePhim, p.Anh,
                   ROUND(AVG(d.DiemSo),1) AS DiemDanhGia,
                   FUNC_DanhGiaHieuQuaPhim(p.MaPhim) AS HieuQua,
                   FUNC_DanhGiaHieuQuaPhim_Moi(p.MaPhim) AS HieuQuaMoi
            FROM PHIM p
            LEFT JOIN DANH_GIA d ON p.MaPhim = d.MaPhim
            WHERE p.TenPhim LIKE ${searchPattern}
            GROUP BY p.MaPhim
            ORDER BY p.NgayKhoiChieu DESC
        `;
        return phims;
    }

    // 2. Xóa phim (Gọi SP_Delete_PHIM_Flexible)
    async deletePhim(id) {
        await prisma.$executeRaw`CALL SP_Delete_PHIM_Flexible(${id})`;
        return { message: "Xóa thành công" };
    }
    
    // 3. Thêm phim (Gọi SP_Insert_PHIM)
    async createPhim(data) {
        const {
            MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, 
            DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh
        } = data;

        try {
            await prisma.$executeRaw`
                CALL SP_Insert_PHIM(
                    ${MaPhim}, ${TenPhim}, ${ThoiLuong}, ${NgonNgu}, ${QuocGia},
                    ${DaoDien}, ${DienVienChinh}, ${new Date(NgayKhoiChieu)}, 
                    ${MoTaNoiDung}, ${DoTuoi}, ${ChuDePhim}
                )
            `;

            // Cập nhật ảnh riêng vì SP chưa hỗ trợ tham số Anh
            if (Anh) {
                await prisma.$executeRaw`UPDATE PHIM SET Anh = ${Anh} WHERE MaPhim = ${MaPhim}`;
            }

            return { message: "Thêm phim thành công" };
        } catch (error) {
            // Lỗi từ SIGNAL SQLSTATE trong SP sẽ văng ra đây
            throw new BadRequestError(error.message.split('\n').pop()); 
        }
    }

    // 4. Cập nhật phim - Gọi SP_Update_PHIM
    async updatePhim(MaPhim, data) {
        const {
            TenPhim, ThoiLuong, NgonNgu, QuocGia, 
            DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim, Anh
        } = data;

        try {
            await prisma.$executeRaw`
                CALL SP_Update_PHIM(
                    ${MaPhim}, ${TenPhim}, ${ThoiLuong}, ${NgonNgu}, ${QuocGia},
                    ${DaoDien}, ${DienVienChinh}, ${new Date(NgayKhoiChieu)}, 
                    ${MoTaNoiDung}, ${DoTuoi}, ${ChuDePhim}
                )
            `;

            // Cập nhật ảnh riêng vì SP chưa hỗ trợ tham số Anh
            if (Anh) {
                await prisma.$executeRaw`UPDATE PHIM SET Anh = ${Anh} WHERE MaPhim = ${MaPhim}`;
            }

            return { message: "Cập nhật phim thành công" };
        } catch (error) {
            throw new BadRequestError(error.message.split('\n').pop());
        }
    }

    // 5. Báo cáo doanh thu (Gọi SP_BaoCaoDoanhThuPhim)
    async getRevenueReport() {
        try {
            // Gọi SP
            const result = await prisma.$queryRaw`CALL SP_BaoCaoDoanhThuPhim();`;
            
            // Prisma CALL result có thể là array hoặc nested
            let data = result;
            
            // Nếu là nested array (result[0] là array), extract nó
            if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
                data = result[0];
            }
            
            // Map f0, f1, f2, f3 thành MaPhim, TenPhim, SoVeDaBan, TongDoanhThu
            return data.map(item => ({
                MaPhim: item.f0 || item.MaPhim,
                TenPhim: item.f1 || item.TenPhim,
                SoVeDaBan: Number(item.f2 || item.SoVeDaBan || 0),
                TongDoanhThu: Number(item.f3 || item.TongDoanhThu || 0)
            }));
        } catch (error) {
            throw new Error("Lỗi khi lấy báo cáo doanh thu: " + error.message);
        }
    }
}

export default new AdminService();