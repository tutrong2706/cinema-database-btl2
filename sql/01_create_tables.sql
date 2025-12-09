DROP DATABASE IF EXISTS CINEMA;
CREATE DATABASE CINEMA CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE CINEMA;
SET NAMES utf8mb4;

-- RẠP CHIẾU PHIM
CREATE TABLE RAP_CHIEU_PHIM (
    MaRapPhim  VARCHAR(20) PRIMARY KEY,
    Ten        VARCHAR(20) NOT NULL,
    ThanhPho   VARCHAR(25) NOT NULL,
    DiaChi     VARCHAR(50) NOT NULL,
    SDT        VARCHAR(15) NOT NULL,
    Email      VARCHAR(50) NOT NULL,
    UNIQUE (Email),
    CHECK (SDT REGEXP '^[0-9]+$'),
    CHECK (Email REGEXP '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')
);

-- PHÒNG CHIẾU
CREATE TABLE PHONG_CHIEU (
    MaPhong   VARCHAR(20) PRIMARY KEY,
    MaRapPhim VARCHAR(20) NOT NULL,
    Ten       VARCHAR(20) NOT NULL,
    Loai      VARCHAR(20) NOT NULL,
    SucChua   INT NOT NULL,
    SoGhe     INT NOT NULL,
    CHECK (SucChua > 0),
    CHECK (SoGhe > 0),
    FOREIGN KEY (MaRapPhim) REFERENCES RAP_CHIEU_PHIM(MaRapPhim)
);

-- GHẾ
CREATE TABLE GHE (
    MaPhong VARCHAR(20) NOT NULL,
    HangGhe VARCHAR(10) NOT NULL,
    SoGhe INT NOT NULL,
    LoaiGhe VARCHAR(10) NOT NULL,
    PRIMARY KEY (MaPhong, HangGhe, SoGhe),
    CHECK (SoGhe > 0),
    FOREIGN KEY (MaPhong) REFERENCES PHONG_CHIEU(MaPhong)
);

-- PHIM
CREATE TABLE PHIM (
    MaPhim VARCHAR(20) PRIMARY KEY,
    TenPhim VARCHAR(200) NOT NULL,
    ThoiLuong INT NOT NULL,
    NgonNgu VARCHAR(50) NOT NULL,
    QuocGia VARCHAR(50) NOT NULL,
    DaoDien VARCHAR(100),
    DienVienChinh VARCHAR(200),
    NgayKhoiChieu DATE NOT NULL,
    MoTaNoiDung TEXT,
    DoTuoi INT NOT NULL,
    ChuDePhim VARCHAR(100),
    CHECK (ThoiLuong > 0),
    CHECK (DoTuoi >= 0)
);

-- THỂ LOẠI
CREATE TABLE THE_LOAI_PHIM (
    MaPhim VARCHAR(20) NOT NULL,
    TheLoai VARCHAR(50) NOT NULL,
    PRIMARY KEY (MaPhim, TheLoai),
    FOREIGN KEY (MaPhim) REFERENCES PHIM(MaPhim)
);

-- KHUYẾN MÃI
CREATE TABLE CHUONG_TRINH_KHUYEN_MAI (
    MaKhuyenMai VARCHAR(20) PRIMARY KEY,
    TenChuongTrinh VARCHAR(200) NOT NULL,
    DieuKien VARCHAR(250),
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    MucGiam DECIMAL(18,2) NOT NULL,
    CHECK (NgayKetThuc >= NgayBatDau),
    CHECK (MucGiam >= 0)
);

-- TÀI KHOẢN
CREATE TABLE TAI_KHOAN (
    MaNguoiDung VARCHAR(20) PRIMARY KEY,
    HoTen VARCHAR(50) NOT NULL,
    DiaChi VARCHAR(200),
    SDT VARCHAR(15),
    GioiTinh CHAR(1),
    Email VARCHAR(50) NOT NULL,
    MatKhau VARCHAR(50) NOT NULL,
    UNIQUE (Email),
    CHECK (GioiTinh IN ('M','F','O') OR GioiTinh IS NULL),
    CHECK (SDT NOT LIKE '%[^0-9]%')
);

-- KHÁCH HÀNG
CREATE TABLE KHACH_HANG (
    MaNguoiDung VARCHAR(20) PRIMARY KEY,
    LoaiThanhVien VARCHAR(20) NOT NULL,
    DiemTichLuy INT NOT NULL DEFAULT 0,
    CHECK (DiemTichLuy >= 0),
    CHECK (LoaiThanhVien IN ('Bronze','Silver','Gold','Platinum')),
    FOREIGN KEY (MaNguoiDung) REFERENCES TAI_KHOAN(MaNguoiDung)
);

-- QUẢN TRỊ VIÊN
CREATE TABLE QUAN_TRI_VIEN (
    MaNguoiDung VARCHAR(20) PRIMARY KEY,
    NgayBatDauLam DATE NOT NULL,
    Luong DECIMAL(18,2) NOT NULL,
    ChucVu VARCHAR(50) NOT NULL,
    CHECK (Luong > 0),
    FOREIGN KEY (MaNguoiDung) REFERENCES TAI_KHOAN(MaNguoiDung)
);

-- CA LÀM VIỆC
CREATE TABLE CA_LAM_VIEC (
    MaCa VARCHAR(20) PRIMARY KEY,
    MaNguoiDung VARCHAR(20) NOT NULL,
    CaLamViec VARCHAR(50) NOT NULL,
    FOREIGN KEY (MaNguoiDung) REFERENCES QUAN_TRI_VIEN(MaNguoiDung)
);

-- MẶT HÀNG
CREATE TABLE MAT_HANG (
    MaHang VARCHAR(20) PRIMARY KEY,
    TenHang VARCHAR(200) NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    SoLuongTon INT NOT NULL,
    MoTa VARCHAR(500),
    LoaiHang VARCHAR(20) NOT NULL,
    CHECK (DonGia >= 0),
    CHECK (SoLuongTon >= 0),
    CHECK (LoaiHang IN ('DO_AN','QUA_LUU_NIEM'))
);

-- ĐƠN HÀNG
CREATE TABLE DON_HANG (
    MaDonHang VARCHAR(20) PRIMARY KEY,
    MaNguoiDung_KH VARCHAR(20) NOT NULL,
    PhuongThuc VARCHAR(50) NOT NULL,
    ThoiGianDat DATETIME NOT NULL,
    TongTien DECIMAL(18,2) NOT NULL,
    TrangThai VARCHAR(20) NOT NULL,
    CHECK (TongTien >= 0),
    CHECK (TrangThai IN ('Chờ thanh toán','Đã thanh toán','Hủy')),
    FOREIGN KEY (MaNguoiDung_KH) REFERENCES KHACH_HANG(MaNguoiDung)
);

-- GỒM
CREATE TABLE GOM (
    MaDonHang VARCHAR(20) NOT NULL,
    MaHang VARCHAR(20) NOT NULL,
    SoLuong INT NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    PRIMARY KEY (MaDonHang, MaHang),
    CHECK (SoLuong > 0),
    CHECK (DonGia >= 0),
    FOREIGN KEY (MaDonHang) REFERENCES DON_HANG(MaDonHang),
    FOREIGN KEY (MaHang) REFERENCES MAT_HANG(MaHang)
);

-- THANH TOÁN
CREATE TABLE THANH_TOAN (
    MaThanhToan VARCHAR(20) PRIMARY KEY,
    MaDonHang VARCHAR(20) NOT NULL UNIQUE,
    NgayThanhToan DATETIME NOT NULL,
    PhuongThuc VARCHAR(50) NOT NULL,
    TrangThai VARCHAR(20) NOT NULL,
    SoTien DECIMAL(18,2) NOT NULL,
    CHECK (SoTien >= 0),
    CHECK (TrangThai IN ('Đang xử lý','Đã thanh toán','Thất bại')),
    FOREIGN KEY (MaDonHang) REFERENCES DON_HANG(MaDonHang)
);

-- TRÌNH CHIẾU
CREATE TABLE TRINH_CHIEU (
    MaRapPhim VARCHAR(20) NOT NULL,
    MaPhim VARCHAR(20) NOT NULL,
    PRIMARY KEY (MaRapPhim, MaPhim),
    FOREIGN KEY (MaRapPhim) REFERENCES RAP_CHIEU_PHIM(MaRapPhim),
    FOREIGN KEY (MaPhim) REFERENCES PHIM(MaPhim)
);

-- SUẤT CHIẾU
CREATE TABLE SUAT_CHIEU (
    MaSuatChieu VARCHAR(20) PRIMARY KEY,
    MaPhim VARCHAR(20) NOT NULL,
    MaPhong VARCHAR(20) NOT NULL,
    NgayChieu DATE NOT NULL,
    GioBatDau TIME NOT NULL,
    GioKetThuc TIME NOT NULL,
    GiaVeCoBan DECIMAL(18,2) NOT NULL,
    TrangThai VARCHAR(20) NOT NULL,
    CHECK (GioKetThuc > GioBatDau),
    CHECK (GiaVeCoBan >= 0),
    CHECK (TrangThai IN ('Đang mở','Hủy','Đã chiếu')),
    FOREIGN KEY (MaPhim) REFERENCES PHIM(MaPhim) ON DELETE CASCADE,
    FOREIGN KEY (MaPhong) REFERENCES PHONG_CHIEU(MaPhong)
);

-- VÉ
CREATE TABLE VE_XEM_PHIM (
    MaVe VARCHAR(20) PRIMARY KEY,
    MaSuatChieu VARCHAR(20) NOT NULL,
    MaPhong VARCHAR(20) NOT NULL,
    HangGhe VARCHAR(10) NOT NULL,
    SoGhe INT NOT NULL,
    MaNguoiDung_KH VARCHAR(20) NOT NULL,
    MaDonHang VARCHAR(20) NOT NULL,
    GiaVeCuoi DECIMAL(18,2) NOT NULL,
    NgayDat DATETIME NOT NULL,
    TrangThai VARCHAR(20) NOT NULL,
    CHECK (GiaVeCuoi >= 0),
    CHECK (TrangThai IN ('Đã đặt','Đã thanh toán','Hủy')),
    FOREIGN KEY (MaSuatChieu) REFERENCES SUAT_CHIEU(MaSuatChieu) ON DELETE CASCADE,
    FOREIGN KEY (MaPhong,HangGhe,SoGhe) REFERENCES GHE(MaPhong,HangGhe,SoGhe),
    FOREIGN KEY (MaNguoiDung_KH) REFERENCES KHACH_HANG(MaNguoiDung),
    FOREIGN KEY (MaDonHang) REFERENCES DON_HANG(MaDonHang)
);

-- ÁP DỤNG KHUYẾN MÃI
CREATE TABLE AP_DUNG (
    MaVe VARCHAR(20) NOT NULL,
    MaKhuyenMai VARCHAR(20) NOT NULL,
    PRIMARY KEY (MaVe, MaKhuyenMai),
    UNIQUE (MaVe),
    FOREIGN KEY (MaVe) REFERENCES VE_XEM_PHIM(MaVe),
    FOREIGN KEY (MaKhuyenMai) REFERENCES CHUONG_TRINH_KHUYEN_MAI(MaKhuyenMai)
);

-- ĐÁNH GIÁ
CREATE TABLE DANH_GIA (
    MaDanhGia VARCHAR(20) PRIMARY KEY,
    MaNguoiDung VARCHAR(20) NOT NULL,
    MaPhim VARCHAR(20) NOT NULL,
    NoiDung VARCHAR(1000),
    NgayDang DATETIME NOT NULL,
    DiemSo INT NOT NULL,
    CHECK (DiemSo BETWEEN 1 AND 10),
    FOREIGN KEY (MaNguoiDung) REFERENCES KHACH_HANG(MaNguoiDung),
    FOREIGN KEY (MaPhim) REFERENCES PHIM(MaPhim) ON DELETE CASCADE
);

-- QUẢN LÝ
CREATE TABLE QUAN_LY (
    MaNguoiDung_QTV VARCHAR(20) NOT NULL,
    MaRapPhim VARCHAR(20) NOT NULL,
    PRIMARY KEY (MaNguoiDung_QTV, MaRapPhim),
    FOREIGN KEY (MaNguoiDung_QTV) REFERENCES QUAN_TRI_VIEN(MaNguoiDung),
    FOREIGN KEY (MaRapPhim) REFERENCES RAP_CHIEU_PHIM(MaRapPhim)
);
