USE CINEMA;
/* =======================================================================
   Tính tổng tiền đơn hàng
   ======================================================================= */
   DELIMITER $$
CREATE TRIGGER TRG_GOM_UpdateTongTien_Insert
AFTER INSERT ON GOM
FOR EACH ROW
BEGIN
    UPDATE DON_HANG
    SET TongTien = TongTien + (NEW.SoLuong * NEW.DonGia)
    WHERE MaDonHang = NEW.MaDonHang;
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER TRG_GOM_UpdateTongTien_Delete
AFTER DELETE ON GOM
FOR EACH ROW
BEGIN
    UPDATE DON_HANG
    SET TongTien = TongTien - (OLD.SoLuong * OLD.DonGia)
    WHERE MaDonHang = OLD.MaDonHang;
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER TRG_GOM_UpdateTongTien_Update
AFTER UPDATE ON GOM
FOR EACH ROW
BEGIN
    DECLARE old_subtotal DECIMAL(18,2);
    DECLARE new_subtotal DECIMAL(18,2);


    SET old_subtotal = OLD.SoLuong * OLD.DonGia;
    SET new_subtotal = NEW.SoLuong * NEW.DonGia;


    UPDATE DON_HANG
    SET TongTien = TongTien - old_subtotal + new_subtotal
    WHERE MaDonHang = NEW.MaDonHang;
END$$
DELIMITER ;

/* =======================================================================
   Tính tổng tiền đơn hàng khi thêm/xóa/sửa VÉ XEM PHIM
   ======================================================================= */
DELIMITER $$
CREATE TRIGGER TRG_VE_UpdateTongTien_Insert
AFTER INSERT ON VE_XEM_PHIM
FOR EACH ROW
BEGIN
    UPDATE DON_HANG
    SET TongTien = TongTien + NEW.GiaVeCuoi
    WHERE MaDonHang = NEW.MaDonHang;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER TRG_VE_UpdateTongTien_Delete
AFTER DELETE ON VE_XEM_PHIM
FOR EACH ROW
BEGIN
    UPDATE DON_HANG
    SET TongTien = TongTien - OLD.GiaVeCuoi
    WHERE MaDonHang = OLD.MaDonHang;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER TRG_VE_UpdateTongTien_Update
AFTER UPDATE ON VE_XEM_PHIM
FOR EACH ROW
BEGIN
    UPDATE DON_HANG
    SET TongTien = TongTien - OLD.GiaVeCuoi + NEW.GiaVeCuoi
    WHERE MaDonHang = NEW.MaDonHang;
END$$
DELIMITER ;