USE CINEMA;
SET NAMES utf8mb4;
-- SET FOREIGN_KEY_CHECKS = 0; -- Tắt kiểm tra khóa ngoại để nạp dữ liệu nhanh và không bị lỗi thứ tự

/* ==========================================================================
   1. TÀI KHOẢN - KHÁCH HÀNG - QUẢN TRỊ VIÊN
   ========================================================================== */
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH001', 'Nguyễn Văn A', 'Q1, TP.HCM', '0901111111', 'M', 'a@example.com', 'passA'),
('KH002', 'Trần Thị B',   'Q3, TP.HCM', '0902222222', 'F', 'b@example.com', 'passB'),
('KH003', 'Lê Văn C',     'Q5, TP.HCM', '0903333333', 'M', 'c@example.com', 'passC'),
('KH004', 'Phạm Thị D',   'Q7, TP.HCM', '0904444444', 'F', 'd@example.com', 'passD'),
('KH005', 'Hoàng Văn E',  'Tân Bình',   '0905555555', 'M', 'e@example.com', 'passE'),
('KH006', 'Vũ Thị F',     'Thủ Đức',    '0906666666', 'F', 'f@example.com', 'passF'),
('KH007', 'Đặng Văn G',   'Bình Thạnh', '0907777777', 'M', 'g@example.com', 'passG'),
('KH008', 'Bùi Thị H',    'Gò Vấp',     '0908888888', 'F', 'h@example.com', 'passH'),
('KH009', 'Ngô Văn I',    'Q12, TP.HCM','0909999999', 'M', 'i@example.com', 'passI'),
('KH010', 'Đỗ Thị K',     'Q10, TP.HCM','0910101010', 'F', 'k@example.com', 'passK'),
('KH011', 'Nguyễn Văn L', 'Q1, TP.HCM', '0911111111', 'M', 'l@example.com', 'passL'),
('KH012', 'Trần Thị M',   'Q3, TP.HCM', '0912222222', 'F', 'm@example.com', 'passM'),
('KH013', 'Lê Văn N',     'Q5, TP.HCM', '0913333333', 'M', 'n@example.com', 'passN'),
('KH014', 'Phạm Thị O',   'Q7, TP.HCM', '0914444444', 'F', 'o@example.com', 'passO'),
('KH015', 'Hoàng Văn P',  'Tân Bình',   '0915555555', 'M', 'p@example.com', 'passP'),
('KH016', 'Vũ Thị Q',     'Thủ Đức',    '0916666666', 'F', 'q@example.com', 'passQ'),
('KH017', 'Đặng Văn R',   'Bình Thạnh', '0917777777', 'M', 'r@example.com', 'passR'),
('KH018', 'Bùi Thị S',    'Gò Vấp',     '0918888888', 'F', 's@example.com', 'passS'),
('KH019', 'Ngô Văn T',    'Q12, TP.HCM','0919999999', 'M', 't@example.com', 'passT'),
('KH020', 'Đỗ Thị U',     'Q10, TP.HCM','0920202020', 'F', 'u@example.com', 'passU'),

('AD001', 'Admin Quản Lý', 'Q1, TP.HCM', '0911111111', 'M', 'admin1@example.com', 'admin1'),
('AD002', 'Admin Trưởng Ca','Q1, TP.HCM','0912222222', 'F', 'admin2@example.com', 'admin2'),
('AD003', 'Admin Kế Toán', 'Q3, TP.HCM', '0913333333', 'F', 'admin3@example.com', 'admin3');

INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES
('KH001', 'Bronze',   10),
('KH002', 'Silver',   50),
('KH003', 'Gold',     120),
('KH004', 'Bronze',    5),
('KH005', 'Platinum',300),
('KH006', 'Silver',   60),
('KH007', 'Bronze',   20),
('KH008', 'Gold',     150),
('KH009', 'Bronze',    0),
('KH010', 'Platinum',450),
('KH011', 'Bronze',   10),
('KH012', 'Silver',   50),
('KH013', 'Gold',     120),
('KH014', 'Bronze',    5),
('KH015', 'Platinum',300),
('KH016', 'Silver',   60),
('KH017', 'Bronze',   20),
('KH018', 'Gold',     150),
('KH019', 'Bronze',    0),
('KH020', 'Platinum',450);

INSERT INTO QUAN_TRI_VIEN (MaNguoiDung, NgayBatDauLam, Luong, ChucVu) VALUES
('AD001', '2024-01-01', 20000000, 'Quản lý rạp'),
('AD002', '2025-06-01', 12000000, 'Trưởng ca'),
('AD003', '2025-09-01', 15000000, 'Kế toán');

INSERT INTO CA_LAM_VIEC (MaCa, MaNguoiDung, CaLamViec) VALUES
('CA001', 'AD001', 'Hành chính'),
('CA002', 'AD002', 'Ca Sáng'),
('CA003', 'AD002', 'Ca Chiều'),
('CA004', 'AD003', 'Hành chính'),
('CA005', 'AD002', 'Ca Tối');

/* ==========================================================================
   2. RẠP – PHÒNG – GHẾ
   ========================================================================== */
INSERT INTO RAP_CHIEU_PHIM (MaRapPhim, Ten, ThanhPho, DiaChi, SDT, Email) VALUES
('RAP001', 'Galaxy Nguyễn Du',       'Hồ Chí Minh', '116 Nguyễn Du, Q1', '02838222222', 'glx.nd@example.com'),
('RAP002', 'CGV Vincom Đồng Khởi',   'Hồ Chí Minh', '72 Lê Thánh Tôn, Q1', '02838333333', 'cgv.dk@example.com'),
('RAP003', 'BHD Bitexco',            'Hồ Chí Minh', '2 Hải Triều, Q1', '02838444444', 'bhd.bt@example.com'),
('RAP004', 'Lotte Gò Vấp',           'Hồ Chí Minh', '242 Nguyễn Văn Lượng', '02838555555', 'lotte.gv@example.com'),
('RAP005', 'CGV Aeon Tân Phú',       'Hồ Chí Minh', '30 Bờ Bao Tân Thắng', '02838666666', 'cgv.tp@example.com');

INSERT INTO PHONG_CHIEU (MaPhong, MaRapPhim, Ten, Loai, SucChua, SoGhe) VALUES
('P001', 'RAP001', 'Phòng 1', '2D',   100, 100),
('P002', 'RAP001', 'Phòng 2', '3D',    80,  80),
('P003', 'RAP002', 'Phòng IMAX', 'IMAX', 150, 150),
('P004', 'RAP003', 'Phòng 4', '2D',    60,  60),
('P005', 'RAP004', 'Phòng 5', '3D',    90,  90),
('P006', 'RAP005', 'Phòng Gold', 'VIP', 40,  40);

-- Đã thêm G012 vào đây để vé VE012 không bị lỗi Foreign Key
INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES
('P001', 'A', 1, 'Thường'), ('P001', 'A', 2, 'Thường'), ('P001', 'A', 3, 'Thường'),
('P001', 'B', 1, 'VIP'),    ('P001', 'B', 2, 'VIP'),
('P002', 'A', 1, 'Thường'), ('P002', 'A', 2, 'Thường'),
('P003', 'C', 5, 'Đôi'),    ('P003', 'C', 6, 'Đôi'),
('P004', 'A', 1, 'Thường'), 
('P005', 'A', 1, 'Thường'),
('P006', 'D', 1, 'Giường nằm'), 
('P006', 'D', 2, 'Giường nằm'); -- Thêm ghế này cho vé hủy

/* ==========================================================================
   3. PHIM – THỂ LOẠI – KHUYẾN MÃI
   ========================================================================== */
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim) VALUES
/* ====== 3. PHIM – THỂ LOẠI – KHUYẾN MÃI ====== */
('PH001', N'Avengers: Endgame', 180, N'English',  N'USA', N'Anthony Russo',
 N'Robert Downey Jr.', '2019-04-26', N'Siêu anh hùng Marvel', 13, N'Siêu anh hùng'),
('PH002', N'Nhà Bà Nữ',          120, N'Tiếng Việt', N'Việt Nam', N'Tristian',
 N'Lê Giang',           '2023-01-22', N'Hài gia đình', 13, N'Gia đình'),
('PH003', N'Fast & Furious 9',   145, N'English',  N'USA', N'Justin Lin',
 N'Vin Diesel',         '2021-05-19', N'Hành động đua xe', 16, N'Hành động'),
('PH004', N'Conan Movie 26',     110, N'Japanese', N'Japan', N'Yuzuru Tachikawa',
 N'Minami Takayama',    '2023-04-14', N'Thám tử lừng danh', 13, N'Hoạt hình'),
('PH005', N'Spider-Man: No Way Home', 150, N'English', N'USA', N'Jon Watts',
 N'Tom Holland',        '2021-12-17', N'Anh hùng Marvel', 13, N'Siêu anh hùng'),
('PH006', 'Dune: Messiah',         160, 'English', 'USA', 'Denis Villeneuve', 'Chalamet', '2025-12-15', 'Khoa học viễn tưởng', 16, 'Viễn tưởng'),
('PH007', 'Lật Mặt 7',             115, 'Tiếng Việt', 'Việt Nam', 'Lý Hải', 'Lý Hải', '2025-12-25', 'Hành động hài', 16, 'Hành động'),
('PH008', 'The Conjuring 3',       100, 'English', 'USA', 'Michael Chaves', 'Patrick Wilson', '2025-10-31', 'Ma ám kinh dị', 18, 'Kinh dị');

INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES
('PH001', 'Hành động'), ('PH002', 'Hài'), ('PH003', 'Hành động'),
('PH004', 'Hoạt hình'), ('PH005', 'Siêu anh hùng'), ('PH006', 'Viễn tưởng'),
('PH007', 'Hành động'), ('PH008', 'Kinh dị');

INSERT INTO CHUONG_TRINH_KHUYEN_MAI (MaKhuyenMai, TenChuongTrinh, DieuKien, NgayBatDau, NgayKetThuc, MucGiam) VALUES
('KM001', 'Thứ 3 vui vẻ', 'Suất chiếu thứ 3', '2025-01-01','2026-12-31', 20000),
('KM002', 'Thành viên Silver', 'Hạng Silver', '2025-01-01','2026-12-31', 15000),
('KM003', 'Combo vé + bắp', 'Mua kèm combo', '2025-02-01','2026-12-31', 10000),
('KM004', 'HSSV', 'Thẻ HSSV', '2025-01-01','2026-06-30', 25000),
('KM005', 'Giáng Sinh 2025', '24-25/12', '2025-12-24','2025-12-25', 50000);

/* ==========================================================================
   4. MẶT HÀNG
   ========================================================================== */
INSERT INTO MAT_HANG (MaHang, TenHang, DonGia, SoLuongTon, MoTa, LoaiHang) VALUES
('MH001', 'Bắp rang bơ',         45000, 100, 'Vị bơ', 'DO_AN'),
('MH002', 'Nước ngọt Coca',      30000, 200, 'Lon 330ml', 'DO_AN'),
('MH003', 'Combo bắp + nước',    70000, 150, 'Tiết kiệm', 'DO_AN'),
('MH004', 'Móc khóa Spider-Man', 60000,  50, 'Móc khóa', 'QUA_LUU_NIEM'),
('MH005', 'Áo thun Avengers',   200000,  30, 'Áo thun', 'QUA_LUU_NIEM'),
('MH006', 'Bắp Phô Mai',         55000,  80, 'Vị phô mai', 'DO_AN'),
('MH007', 'Hotdog',              40000,  60, 'Xúc xích nóng', 'DO_AN'),
('MH008', 'Ly giữ nhiệt Conan', 150000,  40, 'Ly limited', 'QUA_LUU_NIEM');

/* ==========================================================================
   5. ĐƠN HÀNG - GỒM - THANH TOÁN
   ========================================================================== */
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH001', 'KH001', 'Online',   '2025-12-20 10:00', 105000, 'Đã thanh toán'),
('DH002', 'KH002', 'Tại quầy', '2025-12-20 10:15',  70000, 'Chờ thanh toán'),
('DH003', 'KH003', 'Online',   '2025-12-20 11:00',  60000, 'Đã thanh toán'),
('DH004', 'KH004', 'Tại quầy', '2025-12-20 12:30',  80000, 'Hủy'),
('DH005', 'KH005', 'Online',   '2025-12-24 09:00', 400000, 'Đã thanh toán'),
('DH006', 'KH006', 'Online',   '2025-12-24 10:00', 150000, 'Đã thanh toán'),
('DH007', 'KH007', 'App',      '2025-12-24 14:00', 200000, 'Đã thanh toán'),
('DH008', 'KH008', 'Tại quầy', '2025-12-25 18:00',  55000, 'Chờ thanh toán'),
('DH009', 'KH009', 'Online',   '2025-12-25 19:00', 300000, 'Đã thanh toán'),
('DH010', 'KH010', 'Online',   '2025-12-31 20:00', 500000, 'Đã thanh toán'),
('DH011', 'KH001', 'App', '2026-01-01 08:00', 75000, 'Đã thanh toán'),
('DH012', 'KH002', 'Web', '2026-01-01 14:00', 90000, 'Hủy');

INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES
('DH001','MH001',1,45000), ('DH001','MH002',2,30000),
('DH002','MH003',1,70000),
('DH003','MH004',1,60000),
('DH005','MH005',2,200000),
('DH006','MH006',1,55000), ('DH006','MH002',1,30000),
('DH007','MH008',1,150000),('DH007','MH001',1,45000),
('DH008','MH006',1,55000),
('DH009','MH005',1,200000),('DH009','MH007',2,40000),
('DH010','MH008',2,150000),('DH010','MH003',2,70000),
('DH011','MH001',2,45000),
('DH012','MH003',1,70000), ('DH012','MH007',1,40000);

-- THANH TOÁN
INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT001', 'DH001', '2025-12-20 10:05', 'Thẻ',        'Đã thanh toán', 105000),
('TT002', 'DH002', '2025-12-20 10:20', 'Tiền mặt',   'Đang xử lý',     70000),
('TT003', 'DH003', '2025-12-20 11:05', 'Ví điện tử', 'Đã thanh toán',  60000),
('TT004', 'DH004', '2025-12-20 12:40', 'Tiền mặt',   'Thất bại',       80000),
('TT005', 'DH005', '2025-12-24 09:05', 'Thẻ',        'Đã thanh toán', 400000),
('TT006', 'DH006', '2025-12-24 10:05', 'Momo',       'Đã thanh toán', 150000),
('TT007', 'DH007', '2025-12-24 14:05', 'ZaloPay',    'Đã thanh toán', 200000),
('TT008', 'DH008', '2025-12-25 18:10', 'Tiền mặt',   'Đang xử lý',     55000),
('TT009', 'DH009', '2025-12-25 19:10', 'Thẻ',        'Đã thanh toán', 300000),
('TT010', 'DH010', '2025-12-31 20:05', 'Visa',       'Đã thanh toán', 500000),
('TT011', 'DH011', '2026-01-01 08:05', 'Momo', 'Đã thanh toán', 75000),
('TT012', 'DH012', '2026-01-01 14:05', 'Visa', 'Thất bại', 90000);

/* ==========================================================================
   6. TRÌNH CHIẾU – SUẤT CHIẾU
   ========================================================================== */
INSERT INTO TRINH_CHIEU (MaRapPhim, MaPhim) VALUES
('RAP001','PH001'), ('RAP001','PH002'), ('RAP001','PH006'),
('RAP002','PH003'), ('RAP002','PH007'),
('RAP003','PH004'), ('RAP003','PH008'),
('RAP004','PH005'),
('RAP005','PH001');

INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc, GiaVeCoBan, TrangThai) VALUES
-- Ngày 20/12
('SC001','PH001','P001','2025-12-20','09:00','11:30',90000, 'Đã chiếu'),
('SC002','PH002','P001','2025-12-20','12:00','14:00',80000, 'Đã chiếu'),
('SC003','PH003','P002','2025-12-20','15:00','17:30',95000, 'Đã chiếu'),

-- Ngày 24/12 (Giáng sinh)
('SC004','PH005','P003','2025-12-24','10:00','12:30',120000,'Đang mở'),
('SC005','PH006','P004','2025-12-24','13:00','15:40',100000,'Đang mở'),
('SC006','PH007','P005','2025-12-24','19:00','21:00',85000, 'Đang mở'),

-- Ngày 25/12
('SC007','PH002','P001','2025-12-25','20:00','22:00',90000, 'Đang mở'),
('SC008','PH001','P003','2025-12-25','14:00','17:00',130000,'Đang mở'),

-- Ngày 31/12 (Giao thừa)
('SC009','PH008','P002','2025-12-31','21:00','23:00',100000,'Đang mở'),
('SC010','PH004','P006','2025-12-31','18:00','20:00',200000,'Đang mở'),

-- Năm mới 01/01/2026
('SC011','PH002','P001','2026-01-01','10:00','12:00',95000, 'Đang mở'),
('SC012','PH007','P005','2026-01-01','15:00','17:00',90000, 'Đang mở');

/* ==========================================================================
   7. VÉ – ÁP DỤNG
   ========================================================================== */
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai) VALUES
-- 1. Vé cũ đã xem
('VE001','SC001','P001','A',1, 'KH001','DH001', 75000,'2025-12-20 10:00', 'Đã thanh toán'),
('VE002','SC001','P001','A',2, 'KH002','DH002', 90000,'2025-12-20 10:15', 'Đã đặt'),
('VE003','SC002','P001','A',3, 'KH003','DH003', 60000,'2025-12-20 11:00', 'Đã thanh toán'),
('VE004','SC003','P002','A',1, 'KH004','DH004', 95000,'2025-12-20 12:30', 'Hủy'),

-- 2. Vé Giáng sinh
('VE005','SC004','P003','C',5, 'KH005','DH005', 100000,'2025-12-24 09:00', 'Đã thanh toán'),
('VE006','SC004','P003','C',6, 'KH005','DH005', 100000,'2025-12-24 09:00', 'Đã thanh toán'),
('VE007','SC005','P004','A',1, 'KH006','DH006', 90000, '2025-12-24 10:00', 'Đã thanh toán'),
('VE008','SC006','P005','A',1, 'KH007','DH007', 85000, '2025-12-24 14:00', 'Đã thanh toán'),

-- 3. Vé ngày 25/12
('VE009','SC007','P001','A',1, 'KH008','DH008', 90000, '2025-12-25 18:00', 'Đã đặt'),
('VE010','SC008','P003','C',6, 'KH009','DH009', 110000,'2025-12-25 19:00', 'Đã thanh toán'),

-- 4. Vé Giao thừa VIP
('VE011','SC010','P006','D',1, 'KH010','DH010', 180000,'2025-12-31 20:00', 'Đã thanh toán'),
-- Đã thêm G012 vào bảng GHE để vé này không bị lỗi
('VE012','SC010','P006','D',2, 'KH010','DH010', 180000,'2025-12-31 20:00', 'Hủy'), 

-- 5. Vé Năm mới
('VE013','SC011','P001','A',1, 'KH001','DH011', 75000, '2026-01-01 09:00', 'Đã thanh toán'),
('VE014','SC012','P005','A',1, 'KH002','DH012', 90000, '2026-01-01 15:00', 'Hủy');

INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES
('VE001','KM002'),
('VE003','KM001'),
('VE005','KM005'),
('VE006','KM005'),
('VE010','KM003'),
('VE011','KM002');

/* ==========================================================================
   8. ĐÁNH GIÁ & QUẢN LÝ
   ========================================================================== */
INSERT INTO DANH_GIA (MaDanhGia, MaNguoiDung, MaPhim, NoiDung, NgayDang, DiemSo) VALUES
('DG001','KH001','PH001',N'Phim rất hay, cảm xúc.', '2024-11-21 20:00', 9),
('DG002','KH002','PH001',N'Kỹ xảo đẹp.',             '2024-11-21 21:00', 8),
('DG003','KH003','PH002',N'Hài, dễ thương.',         '2024-11-22 19:30', 8),
('DG004','KH004','PH003',N'Nhiều cảnh hành động.',   '2024-11-22 18:45', 7),
('DG005','KH005','PH004',N'Conan quá đỉnh.',         '2024-11-23 22:15', 9),
-- Review cho Avengers: Endgame (PH001)
('DG006', 'KH003', 'PH001', N'Cái kết quá trọn vẹn cho một kỷ nguyên. Yêu Iron Man 3000!', '2024-11-22 09:00:00', 10),
('DG007', 'KH004', 'PH001', N'Phim hơi dài nhưng xứng đáng từng phút giây. Cảnh cuối thật sự xúc động.', '2024-11-23 14:30:00', 9),
('DG008', 'KH005', 'PH001', N'Kỹ xảo đỉnh cao, âm thanh hoành tráng. Xem rạp mới thấy hết cái hay.', '2024-11-24 10:15:00', 10),

-- Review cho Nhà Bà Nữ (PH002)
('DG009', 'KH001', 'PH002', N'Phim đời thường, lời thoại có phần hơi ồn ào nhưng rất thật.', '2024-11-22 16:00:00', 7),
('DG010', 'KH004', 'PH002', N'Cốt truyện ổn, phản ánh đúng mâu thuẫn thế hệ trong gia đình Việt.', '2024-11-23 20:00:00', 8),
('DG011', 'KH005', 'PH002', N'Mình không thích cách giải quyết vấn đề của nhân vật lắm, hơi tiêu cực.', '2024-11-25 11:00:00', 6),

-- Review cho Fast & Furious 9 (PH003)
('DG012', 'KH001', 'PH003', N'Hành động mãn nhãn nhưng kịch bản ngày càng vô lý. Xe bay ra vũ trụ luôn?', '2024-11-22 21:00:00', 6),
('DG013', 'KH002', 'PH003', N'Xem giải trí tốt, không cần suy nghĩ nhiều. Dom và gia đình là bất tử.', '2024-11-23 18:45:00', 7),
('DG014', 'KH005', 'PH003', N'Fan dòng phim hành động sẽ thích, cháy nổ tưng bừng.', '2024-11-24 15:30:00', 8),

-- Review cho Conan Movie 26 (PH004)
('DG015', 'KH001', 'PH004', N'Màn đối đầu với Tổ chức Áo đen quá căng thẳng. Haibara là MVP của phim!', '2024-11-24 09:30:00', 10),
('DG016', 'KH002', 'PH004', N'Nhạc phim hay, cốt truyện kịch tính hơn các phần trước.', '2024-11-24 13:00:00', 9),
('DG017', 'KH003', 'PH004', N'Thích tương tác giữa Conan và Haibara. Rất đáng xem.', '2024-11-25 19:00:00', 9),

-- Review cho Spider-Man: No Way Home (PH005)
('DG018', 'KH002', 'PH005', N'Sự kết hợp của 3 Người Nhện là điều tuyệt vời nhất Marvel từng làm.', '2024-11-22 10:00:00', 10),
('DG019', 'KH003', 'PH005', N'Tuổi thơ ùa về. Willem Dafoe đóng Green Goblin vẫn quá đỉnh.', '2024-11-23 11:20:00', 10),
('DG020', 'KH004', 'PH005', N'Cốt truyện hơi khiên cưỡng đoạn phép thuật lỗi, nhưng fan service quá tốt nên bỏ qua.', '2024-11-24 16:45:00', 8),
('DG021', 'KH001', 'PH005', N'Kết phim hơi buồn cho Peter nhưng mở ra hướng đi mới thú vị.', '2024-11-25 08:30:00', 9),

-- Thêm một vài review trái chiều/ngắn gọn
('DG022', 'KH002', 'PH002', N'Xem cũng được, không xuất sắc như Bố Già.', '2024-11-26 10:00:00', 7),
('DG023', 'KH003', 'PH003', N'Quá ảo ma canada.', '2024-11-26 12:00:00', 5),
('DG024', 'KH004', 'PH004', N'Vụ án lần này hơi dễ đoán hung thủ.', '2024-11-26 14:00:00', 7),
('DG025', 'KH005', 'PH005', N'Must watch! Phim siêu anh hùng hay nhất năm.', '2024-11-26 16:00:00', 10),
-- === 2. PH006: DUNE: MESSIAH (10 Đánh giá) ===
('DG036', 'KH001', 'PH006', N'Hình ảnh tuyệt đẹp, âm thanh choáng ngợp.', '2025-12-16 10:00:00', 10),
('DG037', 'KH002', 'PH006', N'Kiệt tác điện ảnh viễn tưởng.', '2025-12-16 11:30:00', 10),
('DG038', 'KH003', 'PH006', N'Phim hơi chậm, cần kiên nhẫn.', '2025-12-17 09:00:00', 7),
('DG039', 'KH004', 'PH006', N'Timothée Chalamet diễn xuất đỉnh cao.', '2025-12-17 14:00:00', 9),
('DG040', 'KH005', 'PH006', N'Zendaya rất có hồn trong vai Chani.', '2025-12-18 16:00:00', 9),
('DG041', 'KH006', 'PH006', N'Sức mạnh của Paul được thể hiện rất thuyết phục.', '2025-12-18 18:45:00', 10),
('DG042', 'KH007', 'PH006', N'Nên đọc sách trước khi xem.', '2025-12-19 20:00:00', 8),
('DG043', 'KH008', 'PH006', N'Rất thích cảnh cưỡi giun cát.', '2025-12-19 21:30:00', 10),
('DG044', 'KH009', 'PH006', N'Nội dung phức tạp nhưng rất cuốn hút.', '2025-12-20 08:30:00', 9),
('DG045', 'KH010', 'PH006', N'Phim xứng đáng xem IMAX.', '2025-12-20 12:00:00', 10),

-- === 3. PH007: LẬT MẶT 7 (10 Đánh giá) ===
('DG046', 'KH011', 'PH007', N'Hài hước và nhân văn, Lý Hải làm phim ngày càng ổn.', '2025-12-26 10:00:00', 9),
('DG047', 'KH012', 'PH007', N'Phim giải trí tốt, cười từ đầu đến cuối.', '2025-12-26 11:30:00', 8),
('DG048', 'KH013', 'PH007', N'Hành động chưa được như kỳ vọng.', '2025-12-27 09:00:00', 6),
('DG049', 'KH014', 'PH007', N'Thông điệp về gia đình rất ý nghĩa.', '2025-12-27 14:00:00', 10),
('DG050', 'KH015', 'PH007', N'Phim Tết xem rất hợp.', '2025-12-28 16:00:00', 9),
('DG051', 'KH016', 'PH007', N'Cốt truyện đơn giản nhưng cảm động.', '2025-12-28 18:45:00', 8),
('DG052', 'KH017', 'PH007', N'Thích Mạc Văn Khoa.', '2025-12-29 20:00:00', 9),
('DG053', 'KH018', 'PH007', N'Phim Việt đáng tiền nhất năm.', '2025-12-29 21:30:00', 10),
('DG054', 'KH019', 'PH007', N'Lật Mặt chưa bao giờ làm mình thất vọng.', '2025-12-30 08:30:00', 9),
('DG055', 'KH020', 'PH007', N'Cảnh quay ở quê đẹp quá.', '2025-12-30 12:00:00', 9),

-- === 4. PH008: THE CONJURING 3 (10 Đánh giá) ===
('DG056', 'KH001', 'PH008', N'Phim kinh dị đỉnh cao, jump scare liên tục.', '2025-12-07 15:00:00', 9),
('DG057', 'KH002', 'PH008', N'Ám ảnh, xem xong không dám ngủ.', '2025-12-06 12:00:00', 10),
('DG058', 'KH003', 'PH008', N'Cốt truyện hơi đuối hơn phần 1.', '2025-12-05 10:00:00', 7),
('DG059', 'KH004', 'PH008', N'Xem xong phải bật đèn đi ngủ.', '2025-12-04 18:00:00', 10),
('DG060', 'KH005', 'PH008', N'Vẫn là cặp đôi Warring huyền thoại.', '2025-12-03 09:30:00', 9),
('DG061', 'KH006', 'PH008', N'Phim làm rất tốt không khí ma mị.', '2025-12-02 14:00:00', 9),
('DG062', 'KH007', 'PH008', N'Quá nhiều cảnh hù dọa truyền thống.', '2025-12-01 16:00:00', 8),
('DG063', 'KH008', 'PH008', N'Khán giả yếu tim không nên xem.', '2025-11-30 11:00:00', 10),
('DG064', 'KH009', 'PH008', N'Kết phim hơi hụt hẫng.', '2025-11-29 10:00:00', 7),
('DG065', 'KH010', 'PH008', N'Rất hay và hồi hộp.', '2025-11-28 14:00:00', 9);


INSERT INTO QUAN_LY (MaNguoiDung_QTV, MaRapPhim) VALUES
('AD001','RAP001'), ('AD001','RAP002'),
('AD002','RAP003'), ('AD002','RAP004'),
('AD003','RAP005');

-- SET FOREIGN_KEY_CHECKS = 1; -- Bật lại kiểm tra khóa ngoại