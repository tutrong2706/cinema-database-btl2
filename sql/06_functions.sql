USE CINEMA;
SET NAMES utf8mb4;

/* =======================================================================
   CÁC HÀM HỖ TRỢ (FUNCTIONS)
   ======================================================================= */

DELIMITER $$

-- 1. Hàm tính doanh thu của một phim
CREATE FUNCTION FUNC_TinhDoanhThuPhim(p_MaPhim VARCHAR(20)) 
RETURNS DECIMAL(18,2)
DETERMINISTIC
BEGIN
    DECLARE v_DoanhThu DECIMAL(18,2);
    
    SELECT COALESCE(SUM(v.GiaVeCuoi), 0) INTO v_DoanhThu
    FROM VE_XEM_PHIM v
    JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
    WHERE s.MaPhim = p_MaPhim AND v.TrangThai = 'Đã thanh toán';
    
    RETURN v_DoanhThu;
END$$

-- 2. Hàm kiểm tra ghế còn trống không (Trả về 1: Trống, 0: Đã đặt)
CREATE FUNCTION FUNC_KiemTraGheTrong(
    p_MaSuatChieu VARCHAR(20), 
    p_MaPhong VARCHAR(20), 
    p_HangGhe VARCHAR(10), 
    p_SoGhe INT
) 
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_Count INT;
    
    SELECT COUNT(*) INTO v_count
    FROM VE_XEM_PHIM
    WHERE MaSuatChieu = p_MaSuatChieu
      AND MaPhong = p_MaPhong
      AND HangGhe = p_HangGhe
      AND SoGhe = p_SoGhe
      AND TrangThai <> 'Hủy';
      
    IF v_count > 0 THEN
        RETURN 0; -- Đã có người đặt
    ELSE
        RETURN 1; -- Còn trống
    END IF;
END$$

-- 3. Hàm lấy tên phim từ mã suất chiếu
CREATE FUNCTION FUNC_LayTenPhimTuSuatChieu(p_MaSuatChieu VARCHAR(20))
RETURNS VARCHAR(200)
DETERMINISTIC
BEGIN
    DECLARE v_TenPhim VARCHAR(200);
    
    SELECT p.TenPhim INTO v_TenPhim
    FROM SUAT_CHIEU s
    JOIN PHIM p ON s.MaPhim = p.MaPhim
    WHERE s.MaSuatChieu = p_MaSuatChieu;
    
    RETURN v_TenPhim;
END$$

-- 4. Hàm xếp hạng thành viên
CREATE FUNCTION FUNC_XepHangThanhVien(p_MaKH VARCHAR(20)) 
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE v_TongTien DECIMAL(18,2) DEFAULT 0;
    DECLARE v_TienDon DECIMAL(18,2);
    DECLARE done INT DEFAULT FALSE;
    
    -- Khai báo con trỏ duyệt qua các đơn hàng đã thanh toán
    DECLARE cur_donhang CURSOR FOR 
        SELECT TongTien FROM DON_HANG 
        WHERE MaNguoiDung_KH = p_MaKH AND TrangThai = 'Đã thanh toán';
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur_donhang;
    
    read_loop: LOOP
        FETCH cur_donhang INTO v_TienDon;
        IF done THEN
            LEAVE read_loop;
        END IF;
        SET v_TongTien = v_TongTien + v_TienDon;
    END LOOP;
    
    CLOSE cur_donhang;
    
    -- Logic xếp hạng
    IF v_TongTien > 10000000 THEN RETURN 'Platinum';
    ELSEIF v_TongTien > 5000000 THEN RETURN 'Gold';
    ELSEIF v_TongTien > 2000000 THEN RETURN 'Silver';
    ELSE RETURN 'Bronze';
    END IF;
END$$

DELIMITER ;
DROP PROCEDURE IF EXISTS sp_LocPhimTheoNhieuDieuKien;

DELIMITER //

CREATE PROCEDURE sp_LocPhimTheoNhieuDieuKien (
    IN p_TenPhim VARCHAR(200),
    IN p_TheLoai VARCHAR(50),
    IN p_Nam INT
)
BEGIN
    -- Kiểm tra nếu thể loại là chuỗi rỗng thì đặt thành NULL để không lọc
    IF p_TheLoai = '' OR p_TheLoai IS NULL THEN
        SET p_TheLoai = NULL;
    END IF;
    
    -- Kiểm tra nếu tên phim là chuỗi rỗng thì đặt thành NULL để không lọc
    IF p_TenPhim = '' OR p_TenPhim IS NULL THEN
        SET p_TenPhim = NULL;
    END IF;
    
    -- Kiểm tra nếu năm là 0 hoặc NULL thì đặt thành NULL để không lọc
    IF p_Nam = 0 OR p_Nam IS NULL THEN
        SET p_Nam = NULL;
    END IF;
    
    -- Câu truy vấn chính: JOIN 2 bảng, có WHERE, ORDER BY
    SELECT 
        P.MaPhim,
        P.TenPhim,
        -- Giả định tên ảnh, bạn cần bổ sung trường này vào bảng PHIM nếu cần
        CONCAT('poster/', P.MaPhim, '.jpg') AS HinhAnh, 
        P.NgayKhoiChieu,
        TL.TheLoai
    FROM 
        PHIM P
    JOIN 
        THE_LOAI_PHIM TL ON P.MaPhim = TL.MaPhim
    WHERE 
        -- Lọc theo tên phim (sử dụng LIKE và điều kiện IS NOT NULL)
        (p_TenPhim IS NULL OR P.TenPhim LIKE CONCAT('%', p_TenPhim, '%'))
        
        -- Lọc theo thể loại
        AND (p_TheLoai IS NULL OR TL.TheLoai = p_TheLoai)
        
        -- Lọc theo năm công chiếu
        AND (p_Nam IS NULL OR YEAR(P.NgayKhoiChieu) = p_Nam)
    
    -- Sắp xếp theo ngày khởi chiếu mới nhất
    ORDER BY 
        P.NgayKhoiChieu DESC, P.TenPhim ASC;
        
END //

DELIMITER ;