USE CINEMA;

-- 1. Thêm cột Anh vào bảng PHIM
ALTER TABLE PHIM ADD COLUMN Anh VARCHAR(500);

-- 2. Cập nhật Poster (Dùng link ảnh chất lượng cao)
-- Phim 1: Avengers: Endgame
UPDATE PHIM SET Anh = 'https://static0.colliderimages.com/wordpress/wp-content/uploads/2019/03/avengers-endgame-poster.jpg' WHERE MaPhim = 'PH001';

-- Phim 2: Nhà Bà Nữ
UPDATE PHIM SET Anh = 'https://boxofficevietnam.com/wp-content/uploads/2023/01/NBN_MAIN-POSTER_compress.jpg' WHERE MaPhim = 'PH002';

-- Phim 3: Fast & Furious 9
UPDATE PHIM SET Anh = 'https://i.pinimg.com/736x/42/e0/72/42e07294dbb81693532529fe74ebd03f.jpg' WHERE MaPhim = 'PH003';

-- Phim 4: Conan Movie 26
UPDATE PHIM SET Anh = 'https://im4j1ner.com/wp-content/uploads/2023/02/image-9.png' WHERE MaPhim = 'PH004';

-- Phim 5: Spider-Man: No Way Home
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/original/tomAFJjfSCpsufKh1oYcoLmNjT9.jpg' WHERE MaPhim = 'PH005';

-- Phim 6: Dune: Messiah
UPDATE PHIM SET Anh = 'https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg' 
WHERE MaPhim = 'PH006'; -- Dune: Messiah (Sử dụng Poster Dune 2 chất lượng cao)

-- Phim 7: Lật Mặt 7
UPDATE PHIM SET Anh = 'https://tintuc-divineshop.cdn.vccloud.vn/wp-content/uploads/2024/04/poster-lat-mat-7-mot-dieu-uoc-hop-ky-uc-gia-dinh-hua-hen-cau-chuyen-cam-dong_660b97546a4e4.jpeg' 
WHERE MaPhim = 'PH007'; -- Lật Mặt 7 (Sử dụng poster gần nhất/tổng hợp)

-- Phim 8: The Conjuring 3
UPDATE PHIM SET Anh = 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/03/the-conjuring-the-devil-made-me-do-it-poster.jpg' 
WHERE MaPhim = 'PH008'; -- The Conjuring 3 (Sử dụng poster chính thức của phần 'The Devil Made Me Do It')