USE CINEMA;

-- Xóa trigger cũ nếu có để tránh lỗi trùng lặp khi chạy lại
DROP TRIGGER IF EXISTS TRG_SC_CheckNgayPhim;
DROP TRIGGER IF EXISTS TRG_SC_CheckNgayPhim_Update;

-- TRIGGER RB1: Ngày chiếu >= ngày khởi chiếu phim (Xử lý khi INSERT)
DELIMITER $$
CREATE TRIGGER TRG_SC_CheckNgayPhim
BEFORE INSERT ON SUAT_CHIEU  -- Đổi từ AFTER thành BEFORE
FOR EACH ROW
BEGIN
    DECLARE v_NgayKhoiChieu DATE;

    SELECT NgayKhoiChieu INTO v_NgayKhoiChieu
    FROM PHIM
    WHERE MaPhim = NEW.MaPhim;

    IF NEW.NgayChieu < v_NgayKhoiChieu THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ngày chiếu phải >= ngày khởi chiếu phim.';
    END IF;
END$$
DELIMITER ;

-- Bổ sung TRIGGER RB1 cho trường hợp UPDATE (Sửa dữ liệu)
DELIMITER $$
CREATE TRIGGER TRG_SC_CheckNgayPhim_Update
BEFORE UPDATE ON SUAT_CHIEU
FOR EACH ROW
BEGIN
    DECLARE v_NgayKhoiChieu DATE;

    -- Chỉ kiểm tra nếu MaPhim hoặc NgayChieu có sự thay đổi
    IF NEW.MaPhim <> OLD.MaPhim OR NEW.NgayChieu <> OLD.NgayChieu THEN
        SELECT NgayKhoiChieu INTO v_NgayKhoiChieu
        FROM PHIM
        WHERE MaPhim = NEW.MaPhim;

        IF NEW.NgayChieu < v_NgayKhoiChieu THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ngày chiếu cập nhật phải >= ngày khởi chiếu phim.';
        END IF;
    END IF;
END$$
DELIMITER ;


-- TRIGGER RB2: Không trùng thời gian chiếu trong cùng phòng

DELIMITER $$

CREATE TRIGGER TRG_SC_NoOverlapInRoom
AFTER INSERT ON SUAT_CHIEU
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM SUAT_CHIEU s
        WHERE s.MaPhong = NEW.MaPhong
          AND s.NgayChieu = NEW.NgayChieu
          AND s.MaSuatChieu <> NEW.MaSuatChieu
          AND NOT (NEW.GioKetThuc <= s.GioBatDau OR NEW.GioBatDau >= s.GioKetThuc)
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Một phòng chỉ có 1 suất chiếu tại 1 thời điểm.';
    END IF;
END$$

DELIMITER ;
/* =======================================================================
	RB4 – THANH TOÁN VÉ:
   Mỗi nhóm vé gắn với 1 đơn hàng, mỗi đơn hàng chỉ có 1 record thanh toán.
   Vé chỉ được đặt trạng thái 'Đã thanh toán' khi thanh toán của đơn hàng
   tương ứng có trạng thái 'Đã thanh toán'.

   ======================================================================= */
DELIMITER $$

CREATE TRIGGER TRG_VE_CheckThanhToan
BEFORE UPDATE ON VE_XEM_PHIM
FOR EACH ROW
BEGIN
    IF NEW.TrangThai = 'Đã thanh toán' AND NOT EXISTS (
        SELECT 1 FROM THANH_TOAN 
        WHERE MaDonHang = NEW.MaDonHang
          AND TrangThai = 'Đã thanh toán'
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Vé chỉ được thanh toán khi đơn hàng đã thanh toán';
    END IF;
END$$

DELIMITER ;
/* =======================================================================
   RB5 – KHUYẾN MÃI:
   Mã khuyến mãi chỉ hiệu lực khi ngày đặt vé / đặt đơn nằm trong
   [NgayBatDau, NgayKetThuc].
   ======================================================================= */
   DELIMITER $$

CREATE TRIGGER TRG_APDUNG_CheckNgayKhuyenMai
AFTER INSERT ON AP_DUNG
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1
        FROM VE_XEM_PHIM v
        JOIN CHUONG_TRINH_KHUYEN_MAI k ON k.MaKhuyenMai = NEW.MaKhuyenMai
        WHERE v.MaVe = NEW.MaVe
        AND (DATE(v.NgayDat) < k.NgayBatDau OR DATE(v.NgayDat) > k.NgayKetThuc)
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Mã khuyến mãi không nằm trong thời gian hiệu lực.';
    END IF;
END$$

DELIMITER ;
/* =======================================================================
   RB6 – GIÁ VÉ CUỐI:
   Giá vé cuối cùng không được âm, không vượt quá giá cơ bản;
   nếu có khuyến mãi %, giá vé cuối không được lớn hơn
   Giá cơ bản × (1 - %giảm).
   (Nếu có dùng điểm thưởng thì giá chỉ thấp thêm, không cao hơn mức này.)
   ======================================================================= */
DELIMITER $$

CREATE TRIGGER TRG_VE_CheckGiaVeCuoi
AFTER INSERT ON VE_XEM_PHIM
FOR EACH ROW
BEGIN
    DECLARE giaCoBan DECIMAL(10,2);
    DECLARE mucGiam DECIMAL(10,2);

    SELECT s.GiaVeCoBan INTO giaCoBan
    FROM SUAT_CHIEU s
    WHERE s.MaSuatChieu = NEW.MaSuatChieu;

    SELECT k.MucGiam INTO mucGiam
    FROM AP_DUNG ad
    JOIN CHUONG_TRINH_KHUYEN_MAI k ON k.MaKhuyenMai = ad.MaKhuyenMai
    WHERE ad.MaVe = NEW.MaVe
    LIMIT 1;

    -- Giá âm
    IF NEW.GiaVeCuoi < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Giá vé cuối không hợp lệ.';
    END IF;

    -- Giá vượt giá cơ bản
    IF NEW.GiaVeCuoi > giaCoBan THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Giá vé cuối vượt giá cơ bản.';
    END IF;

    -- Nếu có khuyến mãi %
    IF mucGiam IS NOT NULL AND NEW.GiaVeCuoi > (giaCoBan - mucGiam) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Giá vé cuối vượt mức giảm.';
    END IF;
END$$

DELIMITER ;
/* =======================================================================
   RB7 – ĐIỂM THƯỞNG:
   Chỉ cộng điểm khi giao dịch THANH_TOAN chuyển sang 'Đã thanh toán'.
   Ví dụ: cứ 10.000 VND được 1 điểm.
   ======================================================================= */
   
-- Xóa trigger cũ
DROP TRIGGER IF EXISTS TRG_TT_CongDiemThuong;
DROP TRIGGER IF EXISTS TRG_TT_CongDiemThuong_Insert;
DROP TRIGGER IF EXISTS TRG_TT_CongDiemThuong_Update;

DELIMITER $$

-- 1. Xử lý khi INSERT (Thanh toán ngay lúc tạo)
CREATE TRIGGER TRG_TT_CongDiemThuong_Insert
AFTER INSERT ON THANH_TOAN
FOR EACH ROW
BEGIN
    DECLARE v_MaKH VARCHAR(20);
    DECLARE v_MoiHang VARCHAR(20);

    IF NEW.TrangThai = 'Đã thanh toán' THEN
        -- Lấy MaKH từ đơn hàng
        SELECT MaNguoiDung_KH INTO v_MaKH
        FROM DON_HANG
        WHERE MaDonHang = NEW.MaDonHang;

        -- Cập nhật trạng thái đơn hàng thành 'Đã thanh toán' (nếu chưa)
        UPDATE DON_HANG 
        SET TrangThai = 'Đã thanh toán' 
        WHERE MaDonHang = NEW.MaDonHang AND TrangThai <> 'Đã thanh toán';

        -- Cộng điểm tích lũy
        UPDATE KHACH_HANG
        SET DiemTichLuy = DiemTichLuy + FLOOR(NEW.SoTien / 10000)
        WHERE MaNguoiDung = v_MaKH;

        -- Cập nhật hạng thành viên dựa trên tổng chi tiêu
        SET v_MoiHang = FUNC_XepHangThanhVien(v_MaKH);
        UPDATE KHACH_HANG
        SET LoaiThanhVien = v_MoiHang
        WHERE MaNguoiDung = v_MaKH;
    END IF;
END$$

-- 2. Xử lý khi UPDATE (Cập nhật từ trạng thái khác sang Đã thanh toán)
CREATE TRIGGER TRG_TT_CongDiemThuong_Update
AFTER UPDATE ON THANH_TOAN
FOR EACH ROW
BEGIN
    DECLARE v_MaKH VARCHAR(20);
    DECLARE v_MoiHang VARCHAR(20);

    IF NEW.TrangThai = 'Đã thanh toán' AND OLD.TrangThai <> 'Đã thanh toán' THEN
        -- Lấy MaKH từ đơn hàng
        SELECT MaNguoiDung_KH INTO v_MaKH
        FROM DON_HANG
        WHERE MaDonHang = NEW.MaDonHang;

        -- Cập nhật trạng thái đơn hàng thành 'Đã thanh toán' (nếu chưa)
        UPDATE DON_HANG 
        SET TrangThai = 'Đã thanh toán' 
        WHERE MaDonHang = NEW.MaDonHang AND TrangThai <> 'Đã thanh toán';

        -- Cộng điểm tích lũy
        UPDATE KHACH_HANG
        SET DiemTichLuy = DiemTichLuy + FLOOR(NEW.SoTien / 10000)
        WHERE MaNguoiDung = v_MaKH;

        -- Cập nhật hạng thành viên dựa trên tổng chi tiêu
        SET v_MoiHang = FUNC_XepHangThanhVien(v_MaKH);
        UPDATE KHACH_HANG
        SET LoaiThanhVien = v_MoiHang
        WHERE MaNguoiDung = v_MaKH;
    END IF;
END$$

DELIMITER ;
/* =======================================================================
   RB8 – ĐÁNH GIÁ PHIM:
   Khách chỉ được đánh giá phim nếu đã từng mua vé xem phim đó.
   ======================================================================= */
   DELIMITER $$

CREATE TRIGGER TRG_DG_ChiDaMuaVe
BEFORE INSERT ON DANH_GIA
FOR EACH ROW
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM VE_XEM_PHIM v
        JOIN SUAT_CHIEU s ON s.MaSuatChieu = v.MaSuatChieu
        WHERE v.MaNguoiDung_KH = NEW.MaNguoiDung
          AND s.MaPhim = NEW.MaPhim
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Chỉ khách đã mua vé xem phim mới được đánh giá';
    END IF;
END$$

DELIMITER ;
/* =======================================================================
   RB9 – VAI TRÒ NGƯỜI DÙNG:
   Tài khoản có vai trò QUAN_TRI_VIEN không được đặt vé / tạo đơn hàng.
   Chỉ KHACH_HANG được phép.
   ======================================================================= */
   DELIMITER $$

CREATE TRIGGER TRG_DH_KhongChoQTVDat
BEFORE INSERT ON DON_HANG
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM QUAN_TRI_VIEN 
        WHERE MaNguoiDung = NEW.MaNguoiDung_KH
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Quản trị viên không được phép tạo đơn hàng';
    END IF;
END$$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER TRG_VE_KhongChoQTVDat
BEFORE INSERT ON VE_XEM_PHIM
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM QUAN_TRI_VIEN 
        WHERE MaNguoiDung = NEW.MaNguoiDung_KH
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Quản trị viên không được phép đặt vé';
    END IF;
END$$

DELIMITER ;