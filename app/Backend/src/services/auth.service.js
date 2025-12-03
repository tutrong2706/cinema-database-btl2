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
            MoTa: phim.MoTaNoiDung, 
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
        // Gọi SP_TimKiemPhim mà khách cũng dùng được
        const phims = await prisma.$quyerRaw`CALL SP_TimKiemPhim(${keyword})`;
        return phims;
    }
async getNowShowingPhims() {
  const phims = await prisma.phim.findMany({
    select: { MaPhim: true, TenPhim: true, Anh: true }
  });
  return phims;
}
}

export default new authService();