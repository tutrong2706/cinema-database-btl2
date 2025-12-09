USE CINEMA;
SET NAMES utf8mb4;

/* =======================================================================
   BÁO CÁO VÀ TRA CỨU DỮ LIỆU
   ======================================================================= */

DELIMITER $$

-- 1. Xem lịch chiếu phim theo ngày
CREATE PROCEDURE SP_XemLichChieu (
    IN p_NgayChieu DATE
)
BEGIN
    SELECT 
        p.TenPhim,
        r.Ten AS RapChieu,
        pc.Ten AS PhongChieu,
        s.GioBatDau,
        s.GioKetThuc,
        s.GiaVeCoBan,
        (pc.SoGhe - (
            SELECT COUNT(*) FROM VE_XEM_PHIM v 
            WHERE v.MaSuatChieu = s.MaSuatChieu AND v.TrangThai <> 'Hủy'
        )) AS GheTrong
    FROM SUAT_CHIEU s
    JOIN PHIM p ON s.MaPhim = p.MaPhim
    JOIN PHONG_CHIEU pc ON s.MaPhong = pc.MaPhong
    JOIN RAP_CHIEU_PHIM r ON pc.MaRapPhim = r.MaRapPhim
    WHERE s.NgayChieu = p_NgayChieu
    ORDER BY s.GioBatDau;
END$$

-- 2. Báo cáo doanh thu theo phim
CREATE PROCEDURE SP_BaoCaoDoanhThuPhim ()
BEGIN
    SELECT 
        p.MaPhim,
        p.TenPhim,
        COUNT(v.MaVe) AS SoVeDaBan,
        COALESCE(SUM(v.GiaVeCuoi), 0) AS TongDoanhThu
    FROM PHIM p
    LEFT JOIN SUAT_CHIEU s ON p.MaPhim = s.MaPhim
    LEFT JOIN VE_XEM_PHIM v ON s.MaSuatChieu = v.MaSuatChieu AND v.TrangThai = 'Đã thanh toán'
    GROUP BY p.MaPhim, p.TenPhim
    ORDER BY TongDoanhThu DESC;
END$$

-- 3. Lịch sử giao dịch của khách hàng
CREATE PROCEDURE SP_LichSuGiaoDich (
    IN p_MaKH VARCHAR(20)
)
BEGIN
    SELECT 
        dh.MaDonHang,
        dh.ThoiGianDat,
        dh.TongTien,
        dh.TrangThai,
        GROUP_CONCAT(DISTINCT p.TenPhim SEPARATOR ', ') AS PhimDaMua
    FROM DON_HANG dh
    LEFT JOIN VE_XEM_PHIM v ON dh.MaDonHang = v.MaDonHang
    LEFT JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
    LEFT JOIN PHIM p ON s.MaPhim = p.MaPhim
    WHERE dh.MaNguoiDung_KH = p_MaKH
    GROUP BY dh.MaDonHang, dh.ThoiGianDat, dh.TongTien, dh.TrangThai
    ORDER BY dh.ThoiGianDat DESC;
END$$

-- Tìm kiếm phim theo tên (dùng cho Admin UI)
DELIMITER $$
CREATE PROCEDURE SP_TimKiemPhim (IN p_TuKhoa VARCHAR(100))
BEGIN
    SELECT * FROM PHIM 
    WHERE TenPhim LIKE CONCAT('%', p_TuKhoa, '%')
    ORDER BY NgayKhoiChieu DESC;
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