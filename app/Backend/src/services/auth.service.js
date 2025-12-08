import { BadRequestError, InternalServerError, UnAuthorizedError, NotFoundError } from "../helpers/handleError.js";
import prisma from "../common/prisma/prisma.init.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10

class authService {
    // ================================
    //  ĐĂNG KÝ
    // ================================
    async register(data) {
        const {
            email,
            password,
            hoten,
            gioitinh,
            sdt,
            diachi
        } = data;

        // Sửa: Dùng Email (viết hoa chữ cái đầu theo schema)
        const existing = await prisma.tai_khoan.findUnique({
            where: { Email: email }
        });

        if (existing) {
            throw new BadRequestError("Email đã tồn tại");
        }

        const hashed = await bcrypt.hash(password, 10);
        const id = "KH" + Date.now();

        const account = await prisma.tai_khoan.create({
            data: {
                MaNguoiDung: id,
                HoTen: hoten,
                SDT: sdt ?? null,
                GioiTinh: gioitinh ?? null,
                DiaChi: diachi ?? null,
                Email: email,
                MatKhau: hashed,
                khach_hang: {
                    create: {
                        MaNguoiDung: id,
                        LoaiThanhVien: "Bronze", // Mặc định là Bronze cho khớp database
                        DiemTichLuy: 0
                    }
                }
            }
        });

        return account;
    }

    // ================================
    //  ĐĂNG NHẬP
    // ================================
    async login(data) {
        const email = data.email?.trim();
        const password = data.password?.trim();

        if (!email || !password) {
            throw new BadRequestError("Thiếu thông tin bắt buộc");
        }

        // Sửa 1: where: { Email: email } thay vì EMAIL
        // Sửa 2: include thêm quan_tri_vien để check role
        const user = await prisma.tai_khoan.findUnique({
            where: { Email: email },
            include: {
                khach_hang: true,
                quan_tri_vien: true
            }
        });

        if (!user) {
            throw new BadRequestError("User không tồn tại");
        }

        // Sửa 3: Kiểm tra mật khẩu
        // Ưu tiên check bcrypt (cho user mới đăng ký)
        let isMatch = await bcrypt.compare(password, user.MatKhau);
        
        // Nếu bcrypt fail, check so sánh chuỗi thường (cho user cũ trong seed data như 'passA')
        if (!isMatch && password === user.MatKhau) {
            isMatch = true;
        }

        if (!isMatch) {
            throw new BadRequestError("Sai mật khẩu");
        }

        // Sửa 4: Xác định Role (Vì bảng tai_khoan không có cột LoaiTaiKhoan)
        let role = "Guest";
        let loaiThanhVien = null;

        if (user.quan_tri_vien) {
            role = "Admin";
        } else if (user.khach_hang) {
            role = "Customer";
            loaiThanhVien = user.khach_hang.LoaiThanhVien;
        }

        // Sửa 5: user.Email thay vì user.EMAIL
        const payload = {
            userId: user.MaNguoiDung,
            email: user.Email,
            role: role,
            loaiThanhVien: loaiThanhVien
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        return {
            userInfo: {
                email: user.Email,
                role: role,
                loaiThanhVien: loaiThanhVien,
                hoTen: user.HoTen
            },
            token
        };
    }

    // ================================
    //  ĐĂNG XUẤT
    // ================================
    async logout() {
        return { message: "Đăng xuất thành công" };
    }

    async getRaps() {
        const raps = await prisma.rap_chieu_phim.findMany({
            select: {
                MaRapPhim: true,
                Ten: true,
                DiaChi: true
            }
        });
        return raps;
    }

    async getPhimsByRap(MaRapPhim) {
        const data = await prisma.trinh_chieu.findMany({
            where: { MaRapPhim },
            include: {
                phim: true
            }
        });

        if (data.length === 0) {
            // Không throw lỗi ở đây để FE dễ xử lý mảng rỗng
            return [];
        }

        const phims = data.map(item => item.phim);
        
        // Lọc trùng phim (nếu có)
        const unique = [];
        const map = new Map();
        for (const item of phims) {
            if(!map.has(item.MaPhim)){
                map.set(item.MaPhim, true);
                unique.push(item);
            }
        }
        return unique;
    }

    async getPhimDetail(MaPhim) {
        const phim = await prisma.phim.findUnique({
            where: { MaPhim },
            include: {
                the_loai_phim: true,
                danh_gia: true
            }
        });

        if (!phim) {
            throw new NotFoundError("Không tìm thấy phim");
        }

        return {
            MaPhim: phim.MaPhim,
            TenPhim: phim.TenPhim,
            ThoiLuong: phim.ThoiLuong,
            NgonNgu: phim.NgonNgu,
            QuocGia: phim.QuocGia,
            DaoDien: phim.DaoDien,
            DienVienChinh: phim.DienVienChinh,
            NgayKhoiChieu: phim.NgayKhoiChieu,
            MoTa: phim.MoTaNoiDung, 
            DoTuoi: phim.DoTuoi,
            ChuDePhim: phim.ChuDePhim,
            Anh: phim.Anh || "", 
            TheLoai: phim.the_loai_phim.map(t => t.TheLoai), 
            DanhGia: phim.danh_gia
        };
    }

    async getSuatChieus({ MaRapPhim, MaPhim, NgayChieu }) {
        const suatChieus = await prisma.suat_chieu.findMany({
            where: {
                MaPhim: MaPhim,
                NgayChieu: new Date(NgayChieu),
                phong_chieu: {
                    MaRapPhim: MaRapPhim
                }
            },
            include: {
                phim: true,
                phong_chieu: true
            }
        });

        return suatChieus;
    }

    // ================================
    //  ĐẶT VÉ (GỌI STORED PROCEDURE)
    // ================================
    async bookingTicket(data) {
        const {
            MaNguoiDung,
            MaSuatChieu,
            MaPhong,
            DanhSachGhe
        } = data;

        const MaDonHang = "DH" + Date.now();
        
        // Gọi SP tạo đơn hàng
        await prisma.$executeRaw`CALL SP_TaoDonHang(${MaDonHang}, ${MaNguoiDung}, 'Online')`;

        const results = [];
        for (const ghe of DanhSachGhe) {
            const MaVe = "VE" + Math.floor(Math.random() * 1000000);
            try {
                await prisma.$executeRaw`CALL SP_DatVe(${MaVe}, ${MaSuatChieu}, ${MaPhong}, ${ghe.HangGhe}, ${ghe.SoGhe}, ${MaNguoiDung}, ${MaDonHang})`;
                results.push({ MaVe, status: "Success" });
            } catch (error) {
                console.error("Lỗi đặt ghế:", ghe, error.message);
                results.push({ ghe, status: "Failed", reason: error.message });
            }
        }

        return { MaDonHang, results };
    }

    // Thêm hàm này vào class authService
    async searchPhim(keyword = "") {
        const search = keyword ? `%${keyword.trim()}%` : '%';
        
        // Tìm kiếm đa năng trên nhiều trường: Tên, Đạo diễn, Diễn viên, Quốc gia, Năm
        const phims = await prisma.$queryRaw`
            SELECT p.MaPhim, p.TenPhim, p.ThoiLuong, p.NgonNgu, p.QuocGia,
                   p.DaoDien, p.DienVienChinh, p.NgayKhoiChieu, p.MoTaNoiDung,
                   p.DoTuoi, p.ChuDePhim, p.Anh,
                   COALESCE(AVG(d.DiemSo), 0) as DiemDanhGia
            FROM PHIM p
            LEFT JOIN DANH_GIA d ON p.MaPhim = d.MaPhim
            WHERE p.TenPhim LIKE ${search}
               OR p.DaoDien LIKE ${search}
               OR p.DienVienChinh LIKE ${search}
               OR p.QuocGia LIKE ${search}
               OR CAST(YEAR(p.NgayKhoiChieu) AS CHAR) LIKE ${search}
            GROUP BY p.MaPhim
            ORDER BY p.NgayKhoiChieu DESC
        `;
        return phims;
    }
    async getNowShowingPhims() {
        const phims = await prisma.phim.findMany({
            select: {
                MaPhim: true,
                TenPhim: true,
                Anh: true,
                ThoiLuong: true,
                NgayKhoiChieu: true,
                danh_gia: {
                    select: { DiemSo: true }
                }
            },
            orderBy: {
                NgayKhoiChieu: 'desc'
            }
        });

        return phims.map(p => {
            const total = p.danh_gia.reduce((sum, item) => sum + item.DiemSo, 0);
            const avg = p.danh_gia.length ? (total / p.danh_gia.length).toFixed(1) : 0;
            return {
                MaPhim: p.MaPhim,
                TenPhim: p.TenPhim,
                Anh: p.Anh,
                ThoiLuong: p.ThoiLuong,
                NgayKhoiChieu: p.NgayKhoiChieu,
                DiemDanhGia: parseFloat(avg)
            };
        });
    }

    // FIX: Thêm hàm lấy phim theo rating cao nhất
    async getPhimsSortedByRating() {
        // Lấy top 10 phim có điểm đánh giá cao nhất
        const result = await prisma.$queryRaw`
            SELECT p.MaPhim, p.TenPhim, p.Anh, p.ThoiLuong, p.NgayKhoiChieu,
                   COALESCE(AVG(d.DiemSo), 0) as DiemDanhGia
            FROM PHIM p
            LEFT JOIN DANH_GIA d ON p.MaPhim = d.MaPhim
            GROUP BY p.MaPhim
            ORDER BY DiemDanhGia DESC
            LIMIT 10
        `;
        return result;
    }
    async filterPhims({ tenPhim, theLoai, nam }) {
        // Chuyển đổi tham số để phù hợp với SQL (null nếu không có giá trị)
        const searchName = tenPhim ? `%${tenPhim}%` : null;
        const searchGenre = theLoai || null;
        const searchYear = nam || null;

        // Query Raw thay thế SP
        const result = await prisma.$queryRaw`
            SELECT DISTINCT p.MaPhim, p.TenPhim, p.Anh, p.ThoiLuong, p.NgayKhoiChieu, 
                   COALESCE(AVG(d.DiemSo), 0) as DiemDanhGia
            FROM PHIM p
            LEFT JOIN THE_LOAI_PHIM t ON p.MaPhim = t.MaPhim
            LEFT JOIN DANH_GIA d ON p.MaPhim = d.MaPhim
            WHERE (${searchName} IS NULL OR p.TenPhim LIKE ${searchName})
              AND (${searchGenre} IS NULL OR t.TheLoai = ${searchGenre})
              AND (${searchYear} IS NULL OR YEAR(p.NgayKhoiChieu) = ${searchYear})
            GROUP BY p.MaPhim
            ORDER BY p.NgayKhoiChieu DESC
        `;
        
        // Prisma trả về BigInt cho COUNT/AVG đôi khi, cần serialize nếu cần thiết, 
        // nhưng ở đây AVG trả về Decimal/Float, nên ổn.
        return result;
    }

    // ================================
    //  LẤY THÔNG TIN CÁ NHÂN
    // ================================
    async getUserProfile(MaNguoiDung) {
        const user = await prisma.tai_khoan.findUnique({
            where: { MaNguoiDung },
            include: {
                khach_hang: true
            }
        });

        if (!user) {
            throw new NotFoundError("Không tìm thấy thông tin người dùng");
        }

        // Gọi hàm FUNC_XepHangThanhVien để lấy hạng thành viên mới nhất
        const rankResult = await prisma.$queryRaw`SELECT FUNC_XepHangThanhVien(${MaNguoiDung}) as Rank`;
        const updatedRank = rankResult[0]?.Rank || user.khach_hang?.LoaiThanhVien || 'Bronze';

        return {
            MaNguoiDung: user.MaNguoiDung,
            HoTen: user.HoTen,
            Email: user.Email,
            SDT: user.SDT,
            DiaChi: user.DiaChi,
            GioiTinh: user.GioiTinh,
            LoaiThanhVien: updatedRank,
            DiemTichLuy: user.khach_hang?.DiemTichLuy || 0
        };
    }
}

export default new authService();