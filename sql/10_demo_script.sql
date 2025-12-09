USE CINEMA;

-- =======================================================================
-- 1. DEMO HÀM (FUNCTION) - CÓ SỬ DỤNG CON TRỎ (CURSOR) [cite: 37, 39]
-- =======================================================================

-- 1.1. Hàm đánh giá hiệu quả phim (Dùng Cursor duyệt suất chiếu)
-- Mong đợi: Trả về kết quả 'Rất Hot', 'Bình thường' hoặc 'Cần cải thiện' dựa trên dữ liệu thật.
SELECT MaPhim, TenPhim, FUNC_DanhGiaHieuQuaPhim(MaPhim) AS DanhGia 
FROM PHIM;

-- 1.2. Hàm xếp hạng thành viên (Dùng Cursor duyệt đơn hàng tích lũy)
-- Mong đợi: Tính tổng tiền các đơn đã thanh toán và trả về hạng (Gold, Silver...)
SELECT MaNguoiDung, HoTen, FUNC_XepHangThanhVien(MaNguoiDung) AS HangTV 
FROM TAI_KHOAN 
WHERE MaNguoiDung IN ('KH001', 'KH005'); -- KH005 mua nhiều nên hạng cao


-- =======================================================================
-- 2. DEMO THỦ TỤC (STORED PROCEDURE) - THÊM/XÓA/SỬA & VALIDATE [cite: 13, 15]
-- =======================================================================

-- 2.1. Thêm Phim với dữ liệu SAI (Validate dữ liệu)
-- Mong đợi: Báo lỗi "Thời lượng phim phải lớn hơn 0"
CALL SP_Insert_PHIM('PH999', 'Phim Lỗi', -100, 'Việt Nam', 'VN', 'Director', 'Actor', '2025-01-01', 'Mo ta', 18, 'Action');

-- 2.2. Thêm Phim với dữ liệu ĐÚNG
-- Mong đợi: Thành công (1 row affected)
CALL SP_Insert_PHIM('PH999', 'Phim Demo Báo Cáo', 120, 'Tiếng Việt', 'VN', 'Nhóm Demo', 'A & B', '2025-12-01', 'Mô tả test', 13, 'Học Tập');

-- Kiểm tra lại:
SELECT * FROM PHIM WHERE MaPhim = 'PH999';

-- 2.3. Xóa Phim đang có suất chiếu (Ràng buộc nghiệp vụ) [cite: 18]
-- Mong đợi: Báo lỗi "Không thể xóa Phim này. Phim vẫn còn suất chiếu..."
-- (Giả sử PH001 đang có suất chiếu chưa chiếu)
CALL SP_Delete_PHIM_Flexible('PH001');

-- 2.4. Xóa Phim vừa tạo (An toàn)
-- Mong đợi: Thành công
CALL SP_Delete_PHIM_Flexible('PH999');


-- =======================================================================
-- 3. DEMO TRIGGER - RÀNG BUỘC NGHIỆP VỤ & TÍNH TOÁN [cite: 20, 25]
-- =======================================================================

-- 3.1. Trigger RB1: Ngày chiếu < Ngày khởi chiếu [cite: 21]
-- Phim PH001 khởi chiếu 2019. Cố tình tạo suất chiếu năm 2018.
-- Mong đợi: Báo lỗi "Ngày chiếu phải >= ngày khởi chiếu phim"
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai)
VALUES ('SC_FAIL', 'PH001', 'P001', '2018-01-01', '10:00', '12:00', 50000, 'Đang mở');

-- 3.2. Trigger RB2: Tính toán thuộc tính dẫn xuất (Tổng tiền đơn hàng) [cite: 25]
-- Bước 1: Tạo đơn hàng rỗng -> Tổng tiền = 0
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai)
VALUES ('DH_TEST', 'KH001', 'Tại quầy', NOW(), 0, 'Chờ thanh toán');

-- Bước 2: Thêm 2 ly nước (Giá 30k/ly) vào đơn -> Trigger tự chạy
INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES ('DH_TEST', 'MH002', 2, 30000);

-- Bước 3: Kiểm tra Tổng tiền trong Đơn hàng
-- Mong đợi: TongTien tự động nhảy lên 60000
SELECT MaDonHang, TongTien FROM DON_HANG WHERE MaDonHang = 'DH_TEST';

-- Dọn dẹp dữ liệu test
DELETE FROM GOM WHERE MaDonHang = 'DH_TEST';
DELETE FROM DON_HANG WHERE MaDonHang = 'DH_TEST';


-- =======================================================================
-- 4. DEMO BÁO CÁO & TÌM KIẾM [cite: 32]
-- =======================================================================

-- 4.1. Báo cáo doanh thu 
CALL SP_BaoCaoDoanhThuPhim();

-- 4.2. Tìm kiếm phim theo nhiều điều kiện + Tích hợp Hàm đánh giá (admin) 
CALL sp_LocPhimTheoNhieuDieuKien('Avengers', NULL, NULL);
