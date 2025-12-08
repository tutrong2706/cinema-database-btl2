USE CINEMA;
SET NAMES utf8mb4;

/* ====== 1. TÀI KHOẢN, KHÁCH HÀNG, QTV ====== */
INSERT INTO TAI_KHOAN (MaNguoiDung, HoTen, DiaChi, SDT, GioiTinh, Email, MatKhau) VALUES
('KH001', N'Nguyễn Văn A', N'Q1, TP.HCM', '0901111111', 'M', 'a@example.com', 'passA'),
('KH002', N'Trần Thị B',   N'Q3, TP.HCM', '0902222222', 'F', 'b@example.com', 'passB'),
('KH003', N'Lê Văn C',     N'Q5, TP.HCM', '0903333333', 'M', 'c@example.com', 'passC'),
('KH004', N'Phạm Thị D',   N'Q7, TP.HCM', '0904444444', 'F', 'd@example.com', 'passD'),
('KH005', N'Hoàng Văn E',  N'Tân Bình',   '0905555555', 'M', 'e@example.com', 'passE'),
('AD001', N'Admin 1',      N'Q1, TP.HCM', '0911111111', 'M', 'admin1@example.com', 'admin1'),
('AD002', N'Admin 2',      N'Q1, TP.HCM', '0912222222', 'F', 'admin2@example.com', 'admin2');

-- 5 khách hàng
INSERT INTO KHACH_HANG (MaNguoiDung, LoaiThanhVien, DiemTichLuy) VALUES
('KH001', N'Bronze',   10),
('KH002', N'Silver',   50),
('KH003', N'Gold',    120),
('KH004', N'Bronze',    5),
('KH005', N'Platinum',300);

-- 2 quản trị viên
INSERT INTO QUAN_TRI_VIEN (MaNguoiDung, NgayBatDauLam, Luong, ChucVu) VALUES
('AD001', '2024-01-01', 15000000, N'Quản lý rạp'),
('AD002', '2024-02-01', 12000000, N'Trưởng ca');

INSERT INTO CA_LAM_VIEC (MaCa, MaNguoiDung, CaLamViec) VALUES
('CA001', 'AD001', N'Sáng'),
('CA002', 'AD001', N'Chiều'),
('CA003', 'AD002', N'Tối'),
('CA004', 'AD002', N'Cuối tuần'),
('CA005', 'AD001', N'Ngày lễ');



/* ====== 2. RẠP – PHÒNG – GHẾ ====== */
INSERT INTO RAP_CHIEU_PHIM (MaRapPhim, Ten, ThanhPho, DiaChi, SDT, Email) VALUES
('RAP001', N'Galaxy Nguyễn Du',       N'Hồ Chí Minh', N'116 Nguyễn Du, Q1',                 '02838222222', 'galaxy.nd@example.com'),
('RAP002', N'CGV Vincom Đồng Khởi',   N'Hồ Chí Minh', N'72 Lê Thánh Tôn, Q1',               '02838333333', 'cgv.vincom@example.com'),
('RAP003', N'BHD Bitexco',            N'Hồ Chí Minh', N'2 Hải Triều, Q1',                   '02838444444', 'bhd.bitexco@example.com'),
('RAP004', N'Lotte Gò Vấp',           N'Hồ Chí Minh', N'242 Nguyễn Văn Lượng, Gò Vấp',     '02838555555', 'lotte.gv@example.com'),
('RAP005', N'CGV Aeon Tân Phú',       N'Hồ Chí Minh', N'30 Bờ Bao Tân Thắng, Tân Phú',      '02838666666', 'cgv.aeon@example.com');

INSERT INTO PHONG_CHIEU (MaPhong, MaRapPhim, Ten, Loai, SucChua, SoGhe) VALUES
('P001', 'RAP001', N'Phòng 1', N'2D',   100, 100),
('P002', 'RAP001', N'Phòng 2', N'3D',    80,  80),
('P003', 'RAP002', N'Phòng 3', N'IMAX', 150, 150),
('P004', 'RAP003', N'Phòng 4', N'2D',    60,  60),
('P005', 'RAP004', N'Phòng 5', N'3D',    90,  90);

INSERT INTO GHE (MaPhong, HangGhe, SoGhe, LoaiGhe) VALUES
('P001', 'A', 1, N'Thường'),
('P001', 'A', 2, N'Thường'),
('P001', 'B', 3, N'VIP'),
('P002', 'A', 4, N'Thường'),
('P003', 'C', 5, N'Đôi');



/* ====== 3. PHIM – THỂ LOẠI – KHUYẾN MÃI ====== */
INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh,
                  NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim)
VALUES
('PH001', N'Avengers: Endgame', 180, N'English',  N'USA', N'Anthony Russo',
 N'Robert Downey Jr.', '2019-04-26', N'Siêu anh hùng Marvel', 13, N'Siêu anh hùng'),
('PH002', N'Nhà Bà Nữ',          120, N'Tiếng Việt', N'Việt Nam', N'Tristian',
 N'Lê Giang',           '2023-01-22', N'Hài gia đình', 13, N'Gia đình'),
('PH003', N'Fast & Furious 9',   145, N'English',  N'USA', N'Justin Lin',
 N'Vin Diesel',         '2021-05-19', N'Hành động đua xe', 16, N'Hành động'),
('PH004', N'Conan Movie 26',     110, N'Japanese', N'Japan', N'Yuzuru Tachikawa',
 N'Minami Takayama',    '2023-04-14', N'Thám tử lừng danh', 13, N'Hoạt hình'),
('PH005', N'Spider-Man: No Way Home', 150, N'English', N'USA', N'Jon Watts',
 N'Tom Holland',        '2021-12-17', N'Anh hùng Marvel', 13, N'Siêu anh hùng');

INSERT INTO THE_LOAI_PHIM (MaPhim, TheLoai) VALUES
('PH001', N'Hành động'),
('PH001', N'Viễn tưởng'),
('PH002', N'Hài'),
('PH003', N'Hành động'),
('PH004', N'Hoạt hình');


/* =======================================================================
   3. KHUYẾN MÃI (Cập nhật năm 2025)
   ======================================================================= */
INSERT INTO CHUONG_TRINH_KHUYEN_MAI
(MaKhuyenMai, TenChuongTrinh, DieuKien, NgayBatDau, NgayKetThuc, MucGiam)
VALUES
('KM001', N'Thứ 3 vui vẻ', N'Áp dụng suất chiếu thứ 3', '2025-01-01','2025-12-31', 20000),
('KM002', N'Ưu đãi thành viên Silver', N'Khách Silver trở lên', '2025-01-01','2025-12-31', 15000),
('KM003', N'Combo vé + bắp', N'Mua vé kèm combo', '2025-02-01','2025-12-31', 10000),
('KM004', N'Giảm sinh viên', N'Có thẻ sinh viên', '2025-03-01','2025-06-30', 25000),
('KM005', N'Black Friday', N'Ngày 29/11', '2025-11-29','2025-11-29', 50000);


/* =======================================================================
   4. MẶT HÀNG – ĐƠN HÀNG – GỒM – THANH TOÁN
   (Cập nhật: Đơn hàng vừa đặt ngày 06/12 và 07/12/2025)
   ======================================================================= */
INSERT INTO MAT_HANG (MaHang, TenHang, DonGia, SoLuongTon, MoTa, LoaiHang) VALUES
('MH001', N'Bắp rang bơ',         45000, 100, N'Bắp rang vị bơ', N'DO_AN'),
('MH002', N'Nước ngọt Coca',      30000, 200, N'Lon 330ml',      N'DO_AN'),
('MH003', N'Combo bắp + nước',    70000, 150, N'Combo tiết kiệm',N'DO_AN'),
('MH004', N'Móc khóa Spider-Man', 60000,  50, N'Móc khóa nhân vật', N'QUA_LUU_NIEM'),
('MH005', N'Áo thun Avengers',   200000,  30, N'Áo thun in hình', N'QUA_LUU_NIEM');

-- Đơn hàng mới đặt hôm qua và hôm nay
INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai) VALUES
('DH001', 'KH001', N'Online',   '2025-12-06 10:00', 105000, 'Đã thanh toán'),
('DH002', 'KH002', N'Tại quầy', '2025-12-06 10:15',  70000, 'Chờ thanh toán'),
('DH003', 'KH003', N'Online',   '2025-12-07 09:00',  60000, 'Đã thanh toán'),
('DH004', 'KH004', N'Tại quầy', '2025-12-07 12:30',  80000, 'Hủy'),
('DH005', 'KH005', N'Online',   '2025-12-07 13:45', 400000, 'Đã thanh toán');

INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia) VALUES
('DH001','MH001',1,45000),
('DH001','MH002',2,30000),
('DH002','MH003',1,70000),
('DH003','MH004',1,60000),
('DH005','MH005',2,200000);

INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES
('TT001','DH001','2025-12-06 10:05', N'Thẻ',        'Đã thanh toán', 105000),
('TT002','DH002','2025-12-06 10:20', N'Tiền mặt',   'Đang xử lý',     70000),
('TT003','DH003','2025-12-07 09:05', N'Ví điện tử', 'Đã thanh toán',  60000),
('TT004','DH004','2025-12-07 12:40', N'Tiền mặt',   'Thất bại',       80000),
('TT005','DH005','2025-12-07 13:50', N'Thẻ',        'Đã thanh toán', 400000);


/* =======================================================================
   5. TRÌNH CHIẾU – SUẤT CHIẾU
   (Cập nhật: Suất chiếu TƯƠNG LAI - Ngày 08/12 và 09/12/2025)
   ======================================================================= */
INSERT INTO TRINH_CHIEU (MaRapPhim, MaPhim) VALUES
('RAP001','PH001'),
('RAP001','PH002'),
('RAP002','PH003'),
('RAP003','PH004'),
('RAP004','PH005');

-- Suất chiếu vào ngày mai (08/12) và ngày kia (09/12) để khách có thể đặt vé
INSERT INTO SUAT_CHIEU (MaSuatChieu, MaPhim, MaPhong, NgayChieu, GioBatDau, GioKetThuc,
                        GiaVeCoBan, TrangThai)
VALUES
('SC001','PH001','P001','2025-12-08','09:00','11:30',90000, N'Đang mở'),
('SC002','PH002','P001','2025-12-08','12:00','14:00',80000, N'Đang mở'),
('SC003','PH003','P002','2025-12-08','15:00','17:30',95000, N'Đang mở'),
('SC004','PH004','P003','2025-12-09','10:00','12:00',70000, N'Đang mở'),
('SC005','PH005','P004','2025-12-09','13:00','15:30',90000, N'Đang mở');


/* =======================================================================
   6. VÉ – ÁP DỤNG
   (Logic: Khách đặt vé TRƯỚC ngày chiếu -> Ngày đặt < Ngày chiếu)
   ======================================================================= */
INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe,
                         MaNguoiDung_KH, MaDonHang,
                         GiaVeCuoi, NgayDat, TrangThai)
VALUES
-- Vé cho suất ngày 08/12, đặt vào ngày 06/12
('VE001','SC001','P001','A',1, 'KH001','DH001', 75000,'2025-12-06 10:00', 'Đã thanh toán'),
('VE002','SC001','P001','A',2, 'KH002','DH002', 90000,'2025-12-06 10:15', 'Đã đặt'),

-- Vé cho suất ngày 08/12, đặt vào ngày 07/12
('VE003','SC002','P001','B',3, 'KH003','DH003', 60000,'2025-12-07 09:00', 'Đã thanh toán'),
('VE004','SC003','P002','A',4, 'KH004','DH004', 95000,'2025-12-07 12:30', 'Hủy'), -- Vé bị hủy

-- Vé cho suất ngày 09/12, đặt vào ngày 07/12
('VE005','SC004','P003','C',5, 'KH005','DH005', 60000,'2025-12-07 13:45', 'Đã thanh toán');


INSERT INTO AP_DUNG (MaVe, MaKhuyenMai) VALUES
('VE001','KM002'),
('VE003','KM001'),
('VE005','KM003');

/* ====== 7. ĐÁNH GIÁ ====== */

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
('DG025', 'KH005', 'PH005', N'Must watch! Phim siêu anh hùng hay nhất năm.', '2024-11-26 16:00:00', 10);



/* ====== 8. QUẢN LÝ ====== */
INSERT INTO QUAN_LY (MaNguoiDung_QTV, MaRapPhim) VALUES
('AD001','RAP001'),
('AD001','RAP002'),
('AD002','RAP003'),
('AD002','RAP004'),
('AD001','RAP005');

