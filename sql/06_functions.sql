USE CINEMA;
SET NAMES utf8mb4;

/* =======================================================================
   CÁC HÀM HỖ TRỢ (FUNCTIONS)
   ======================================================================= */

DELIMITER $$

-- 1. Hàm đánh giá hiệu quả phim (Sử dụng CURSOR & LOOP)
-- Logic: Duyệt qua lịch sử các suất chiếu, so sánh vé bán ra vs sức chứa rạp
CREATE FUNCTION FUNC_DanhGiaHieuQuaPhim(p_MaPhim VARCHAR(20)) 
RETURNS VARCHAR(50)
DETERMINISTIC
BEGIN
    DECLARE v_TongGheBan INT DEFAULT 0;
    DECLARE v_TongGheRap INT DEFAULT 0;
    DECLARE v_SoGheSuat INT DEFAULT 0;
    DECLARE v_SucChuaPhong INT DEFAULT 0;
    DECLARE v_TyLe DECIMAL(5,2);
    DECLARE v_KetQua VARCHAR(50);
    
    DECLARE done INT DEFAULT FALSE;
    
    -- Khai báo con trỏ: Lấy số vé bán được và sức chứa của từng suất chiếu thuộc phim này
    DECLARE cur_suatchieu CURSOR FOR 
        SELECT 
            (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = s.MaSuatChieu AND TrangThai <> 'Hủy'),
            pc.SucChua
        FROM SUAT_CHIEU s
        JOIN PHONG_CHIEU pc ON s.MaPhong = pc.MaPhong
        WHERE s.MaPhim = p_MaPhim AND s.TrangThai <> 'Hủy';
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur_suatchieu;
    
    read_loop: LOOP
        FETCH cur_suatchieu INTO v_SoGheSuat, v_SucChuaPhong;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Cộng dồn số liệu
        SET v_TongGheBan = v_TongGheBan + v_SoGheSuat;
        SET v_TongGheRap = v_TongGheRap + v_SucChuaPhong;
    END LOOP;
    
    CLOSE cur_suatchieu;
    
    -- Đánh giá dựa trên tỷ lệ lấp đầy
    IF v_TongGheRap = 0 THEN
        RETURN 'Chưa có dữ liệu';
    ELSE
        SET v_TyLe = (v_TongGheBan / v_TongGheRap) * 100;
        
        IF v_TyLe >= 80 THEN
            SET v_KetQua = CONCAT('Rất Hot (', v_TyLe, '%)');
        ELSEIF v_TyLe >= 50 THEN
            SET v_KetQua = CONCAT('Bình thường (', v_TyLe, '%)');
        ELSE
            SET v_KetQua = CONCAT('Cần cải thiện (', v_TyLe, '%)');
        END IF;
    END IF;
    
    RETURN v_KetQua;
END$$

-- 1. Hàm đánh giá hiệu quả phim (Dựa trên thị phần vé bán ra)
-- Logic: So sánh số vé bán được của phim so với tổng số vé bán ra của toàn rạp
DROP FUNCTION IF EXISTS FUNC_DanhGiaHieuQuaPhim_Moi$$
CREATE FUNCTION FUNC_DanhGiaHieuQuaPhim_Moi(p_MaPhim VARCHAR(20)) 
RETURNS VARCHAR(50)
DETERMINISTIC
BEGIN
    -- Biến để lưu trữ tổng số vé bán được của phim hiện tại
    DECLARE v_VeBanPhim INT DEFAULT 0;
    -- Biến để lưu trữ tổng số vé bán được của TOÀN BỘ RẠP
    DECLARE v_TongVeBanToanRap INT DEFAULT 0;
    
    DECLARE v_TyLe DECIMAL(5,2);
    DECLARE v_KetQua VARCHAR(50);
    
    -- Biến Cursor
    DECLARE v_MaSC VARCHAR(20);
    DECLARE v_SoVeSuat INT;
    DECLARE done INT DEFAULT FALSE;

    -- 2. Khai báo Cursor: Lấy từng Suất chiếu của bộ phim đang xét
    DECLARE cur_ve_phim CURSOR FOR 
        SELECT 
            s.MaSuatChieu,
            (SELECT COUNT(*) FROM VE_XEM_PHIM v 
             WHERE v.MaSuatChieu = s.MaSuatChieu AND v.TrangThai IN ('Đã đặt', 'Đã thanh toán'))
        FROM SUAT_CHIEU s
        WHERE s.MaPhim = p_MaPhim AND s.TrangThai <> 'Hủy';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- 1. Tính Tổng số vé đã bán ra của TOÀN BỘ PHIM TRONG RẠP (Tính trước, không dùng Cursor)
    SELECT COUNT(MaVe) INTO v_TongVeBanToanRap
    FROM VE_XEM_PHIM
    WHERE TrangThai IN ('Đã đặt', 'Đã thanh toán');
    
    
    -- Xử lý trường hợp không có vé nào được bán trên toàn hệ thống
    IF v_TongVeBanToanRap = 0 THEN
        RETURN 'Chưa có giao dịch';
    END IF;

    -- 3. Mở và Lặp qua Cursor để tính Tổng vé bán của phim đó
    OPEN cur_ve_phim;
    
    read_loop: LOOP
        FETCH cur_ve_phim INTO v_MaSC, v_SoVeSuat;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Cộng dồn số vé bán được của từng suất chiếu vào tổng của phim
        SET v_VeBanPhim = v_VeBanPhim + v_SoVeSuat;
    END LOOP;
    
    CLOSE cur_ve_phim;
    
    -- 4. Đánh giá dựa trên Tỷ lệ Thị phần Vé (Công thức: Vé bán phim / Tổng vé bán toàn rạp)
    
    -- Tính Thị phần Vé
    SET v_TyLe = (v_VeBanPhim / v_TongVeBanToanRap) * 100;
    
    -- Phân loại độ hot
    IF v_TyLe >= 25 THEN
        SET v_KetQua = CONCAT('Tuyệt vời (Thị phần: ', FORMAT(v_TyLe, 2), '%)');
    ELSEIF v_TyLe >= 15 THEN
        SET v_KetQua = CONCAT('Hot (Thị phần: ', FORMAT(v_TyLe, 2), '%)');
    ELSEIF v_TyLe >= 5 THEN
        SET v_KetQua = CONCAT('Bình thường (Thị phần: ', FORMAT(v_TyLe, 2), '%)');
    ELSE
        SET v_KetQua = CONCAT('Thấp (Thị phần: ', FORMAT(v_TyLe, 2), '%)');
    END IF;
    
    RETURN v_KetQua;
END$$

-- 2. Hàm xếp hạng thành viên (Sử dụng CURSOR & LOOP)
-- Logic: Duyệt qua từng đơn hàng đã thanh toán để tính tổng tiền tích lũy thực tế
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

DROP FUNCTION IF EXISTS FUNC_TinhDoanhThuVe$$

-- 3a. Hàm tính doanh thu vé của một phim
CREATE FUNCTION FUNC_TinhDoanhThuVe(p_MaPhim VARCHAR(20)) 
RETURNS DECIMAL(18,2)
DETERMINISTIC
BEGIN
    DECLARE v_DoanhThuVe DECIMAL(18,2);
    
    SELECT COALESCE(SUM(v.GiaVeCuoi), 0) INTO v_DoanhThuVe
    FROM VE_XEM_PHIM v
    JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
    WHERE s.MaPhim = p_MaPhim AND v.TrangThai = 'Đã thanh toán';
    
    RETURN v_DoanhThuVe;
END$$

DROP FUNCTION IF EXISTS FUNC_TinhDoanhThuCombo$$

-- 3b. Hàm tính doanh thu combo của một phim
CREATE FUNCTION FUNC_TinhDoanhThuCombo(p_MaPhim VARCHAR(20)) 
RETURNS DECIMAL(18,2)
DETERMINISTIC
BEGIN
    DECLARE v_DoanhThuCombo DECIMAL(18,2);
    
    SELECT COALESCE(SUM(g.SoLuong * g.DonGia), 0) INTO v_DoanhThuCombo
    FROM GOM g
    WHERE g.MaDonHang IN (
        SELECT DISTINCT v.MaDonHang
        FROM VE_XEM_PHIM v
        JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
        WHERE s.MaPhim = p_MaPhim AND v.TrangThai = 'Đã thanh toán'
    );
    
    RETURN v_DoanhThuCombo;
END$$

-- 3. Hàm tính doanh thu của một phim (Bao gồm cả vé và đồ ăn đi kèm trong đơn hàng)
CREATE FUNCTION FUNC_TinhDoanhThuPhim(p_MaPhim VARCHAR(20)) 
RETURNS DECIMAL(18,2)
DETERMINISTIC
BEGIN
    DECLARE v_DoanhThuVe DECIMAL(18,2);
    DECLARE v_DoanhThuCombo DECIMAL(18,2);
    
    -- 1. Tính tiền vé
    SELECT COALESCE(SUM(v.GiaVeCuoi), 0) INTO v_DoanhThuVe
    FROM VE_XEM_PHIM v
    JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
    WHERE s.MaPhim = p_MaPhim AND v.TrangThai = 'Đã thanh toán';
    
    -- 2. Tính tiền combo (Chỉ tính cho các đơn hàng CÓ chứa vé của phim này)
    SELECT COALESCE(SUM(g.SoLuong * g.DonGia), 0) INTO v_DoanhThuCombo
    FROM GOM g
    WHERE g.MaDonHang IN (
        SELECT DISTINCT v.MaDonHang
        FROM VE_XEM_PHIM v
        JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
        WHERE s.MaPhim = p_MaPhim AND v.TrangThai = 'Đã thanh toán'
    );
    
    RETURN v_DoanhThuVe + v_DoanhThuCombo;
END$$

-- 4. Hàm kiểm tra ghế còn trống không (Trả về 1: Trống, 0: Đã đặt)
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

-- 5. Hàm lấy tên phim từ mã suất chiếu
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

DELIMITER ;

/* =======================================================================
   STORED PROCEDURE TÌM KIẾM/LỌC PHIM (Đã cập nhật gọi hàm đánh giá)
   ======================================================================= */

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_LocPhimTheoNhieuDieuKien$$

CREATE PROCEDURE sp_LocPhimTheoNhieuDieuKien (
    IN p_TenPhim VARCHAR(200),
    IN p_TheLoai VARCHAR(50),
    IN p_Nam INT
)
BEGIN
    -- Xử lý tham số rỗng
    IF p_TheLoai = '' OR p_TheLoai IS NULL THEN SET p_TheLoai = NULL; END IF;
    IF p_TenPhim = '' OR p_TenPhim IS NULL THEN SET p_TenPhim = NULL; END IF;
    IF p_Nam = 0 OR p_Nam IS NULL THEN SET p_Nam = NULL; END IF;

    -- Query chính: Đã tích hợp gọi hàm FUNC_DanhGiaHieuQuaPhim
    SELECT 
        P.MaPhim,
        P.TenPhim,
        P.NgayKhoiChieu,
        TL.TheLoai,
        FUNC_DanhGiaHieuQuaPhim(P.MaPhim) AS HieuQua -- Tự động tính đánh giá
    FROM 
        PHIM P
    JOIN 
        THE_LOAI_PHIM TL ON P.MaPhim = TL.MaPhim
    WHERE 
        (p_TenPhim IS NULL OR P.TenPhim LIKE CONCAT('%', p_TenPhim, '%'))
        AND (p_TheLoai IS NULL OR TL.TheLoai = p_TheLoai)
        AND (p_Nam IS NULL OR YEAR(P.NgayKhoiChieu) = p_Nam)
    ORDER BY 
        P.NgayKhoiChieu DESC,
        P.TenPhim ASC;
END$$

DELIMITER ;