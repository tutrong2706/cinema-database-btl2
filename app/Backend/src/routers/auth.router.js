import authController from "../controllers/auth.controller.js";
import express from "express";
import adminRouter from "./admin.router.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/raps',authController.raps);
authRouter.get('/raps/:MaRapPhim/phims', authController.getPhimsByRap);
authRouter.get('/phims/search', authController.searchPhim); // API tìm kiếm công khai (Đặt trước :MaPhim để tránh conflict)
authRouter.get('/phims/:MaPhim', authController.getPhimDetail);
authRouter.get('/suat-chieus', authController.getSuatChieus);
authRouter.get('/dang-chieu', authController.getNowShowingPhims);
authRouter.get('/sorted-by-rating',authController.getPhimsSortedByRating);
authRouter.get('/filter', authController.filterPhims);
authRouter.get('/profile', authMiddleware, authController.getUserProfile);
authRouter.get('/combos', authController.getCombos);
authRouter.post('/booking', authMiddleware, authController.booking);
authRouter.get('/suat-chieus/:MaSuatChieu/booked-seats', authController.getBookedSeats);
authRouter.post('/orders/:MaDonHang/pay', authMiddleware, authController.payOrder);
authRouter.post('/orders/:MaDonHang/cancel', authMiddleware, authController.cancelOrder);
authRouter.get('/orders/:MaDonHang', authMiddleware, authController.getOrderDetails);

export default authRouter;