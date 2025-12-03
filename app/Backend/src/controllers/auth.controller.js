import authService from "../services/auth.service.js";
import { handleSuccessResponse } from "../helpers/handleResponse.js";

class AuthController{

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản khách hàng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - hoten
 *               - gioitinh
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *               hoten:
 *                 type: string
 *                 example: "Nguyễn Vạn Xuân"
 *               gioitinh:
 *                 type: string
 *                 example: "M"
 *               sdt:
 *                 type: string
 *                 example: "0912345678"
 *                 description: Số điện thoại (tùy chọn)
 *               diachi:
 *                 type: string
 *                 example: "Quận 1, TP.HCM"
 *                 description: Địa chỉ (tùy chọn)
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       400:
 *         description: Thông tin không hợp lệ
 *       500:
 *         description: Lỗi server
 */

    async register(req, res, next){
        try{
            const data = req.body;
            const result = await authService.register(data);
            const response = handleSuccessResponse(200, "Đăng ký thành công", result);

            res.status(200).json(response)
        } catch(error){
            next(error)
        }
    }


    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Đăng nhập khách hàng
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "phap@hcmut.edu.vn"
     *                 description: Email hoặc tài khoản đăng nhập
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "12345678"
     *                 description: Mật khẩu
     *     responses:
     *       200:
     *         description: Đăng nhập thành công
     *       400:
     *         description: Thiếu thông tin đăng nhập
     *       401:
     *         description: Thông tin đăng nhập không đúng hoặc không phải tài khoản khách hàng
     *       500:
     *         description: Lỗi hệ thống trong quá trình đăng nhập
     */
    async login(req, res, next){
        try{
            const data = req.body;
            const result = await authService.login(data);
            const response = handleSuccessResponse(200, "Đăng nhập thành công", result);

            res.status(200).json(response)
        } catch(error){
            next(error)
        }
    }

    /**
     * @swagger
     * post:
     * /auth/logout:
     *   post:
     *     summary: Đăng xuất
     *     tags: [Auth]
     *   responses:
     *     200:
     *       description: Đăng xuất thành công
     *     500:
     *       description: Internal Server Error
     */

    async logout(req, res, next){
        try{
            const result = await authService.logout();
            const response = handleSuccessResponse(200, "Đăng xuất thành công", result)

            res.status(200).json(response)
        } catch(error){
            next(error)
        }
    }

    /**
 * @swagger
 * /auth/raps:
 *   get:
 *     summary: Lấy danh sách rạp chiếu phim
 *     tags: [Auth]
 *     description: Trả về toàn bộ danh sách rạp chiếu phim trong hệ thống.
 *     responses:
 *       200:
 *         description: Lấy danh sách rạp thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaRapPhim:
 *                     type: integer
 *                     example: 1
 *                   Ten:
 *                     type: string
 *                     example: "CGV Hùng Vương Plaza"
 *                   DiaChi:
 *                     type: string
 *                     example: "Hùng Vương, Q.5, TP.HCM"
 *       500:
 *         description: Lỗi server
 */

    async raps(req, res, next) {
    try {
        const result = await authService.getRaps();

        const response = handleSuccessResponse(
            200,
            "Lấy danh sách rạp thành công",
            result
        );

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
/**
 * @swagger
 * /auth/raps/{MaRapPhim}/phims:
 *   get:
 *     summary: Lấy danh sách phim đang chiếu tại một rạp
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: MaRapPhim
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã rạp chiếu phim
 *     responses:
 *       200:
 *         description: Danh sách phim đang chiếu tại rạp
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaPhim:
 *                     type: integer
 *                   TenPhim:
 *                     type: string
 *                   ThoiLuong:
 *                     type: integer
 *                   TheLoai:
 *                     type: string
 *                   Anh:
 *                     type: string
 *       404:
 *         description: Không có phim tại rạp
 *       500:
 *         description: Lỗi server
 */

async getPhimsByRap(req, res, next) {
    try {
        const { MaRapPhim } = req.params;

        if (!MaRapPhim) {
            throw new BadRequestError("Thiếu mã rạp phim");
        }

        const result = await authService.getPhimsByRap(MaRapPhim);

        const response = handleSuccessResponse(
            200,
            "Lấy danh sách phim theo rạp thành công",
            result
        );

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}


/**
 * @swagger
 * /auth/phims/{MaPhim}:
 *   get:
 *     summary: Lấy chi tiết phim theo mã phim
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: MaPhim
 *         required: true
 *         schema:
 *           type: string   
 *         description: Mã phim
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết phim, thể loại và đánh giá
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaPhim:
 *                   type: integer
 *                 TenPhim:
 *                   type: string
 *                 ThoiLuong:
 *                   type: integer
 *                 MoTa:
 *                   type: string
 *                 Anh:
 *                   type: string
 *                 TheLoai:
 *                   type: array
 *                   items:
 *                     type: string
 *                 DanhGia:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MaDanhGia:
 *                         type: integer
 *                       SoSao:
 *                         type: number
 *                       NhanXet:
 *                         type: string
 *       404:
 *         description: Không tìm thấy phim
 *       500:
 *         description: Lỗi server
 */

async getPhimDetail(req, res, next) {
    try {
        const { MaPhim } = req.params;

        if (!MaPhim) {
            throw new BadRequestError("Thiếu mã phim");
        }

        const result = await authService.getPhimDetail(MaPhim);

        const response = handleSuccessResponse(
            200,
            "Lấy thông tin chi tiết phim thành công",
            result
        );

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
/**
 * @swagger
 * /authu/suat-chieus:
 *   get:
 *     summary: Tìm suất chiếu theo Rạp, Phim và Ngày
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: MaRapPhim
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã rạp chiếu phim
 *       - in: query
 *         name: MaPhim
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã phim
 *       - in: query
 *         name: NgayChieu
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày chiếu (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Danh sách suất chiếu phù hợp
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaSuatChieu:
 *                     type: integer
 *                   MaPhim:
 *                     type: string
 *                   NgayChieu:
 *                     type: string
 *                     format: date
 *                   GioBatDau:
 *                     type: string
 *                   GioKetThuc:
 *                     type: string
 *                   phong_chieu:
 *                     type: object
 *                     properties:
 *                       MaPhong:
 *                         type: string
 *                       TenPhong:
 *                         type: string
 *                       MaRapPhim:
 *                         type: string
 *       404:
 *         description: Không tìm thấy suất chiếu
 *       500:
 *         description: Lỗi server
 */


async getSuatChieus(req, res, next) {
    try {
        const { MaRapPhim, MaPhim, NgayChieu } = req.query;

        if (!MaRapPhim || !MaPhim || !NgayChieu) {
            throw new BadRequestError("Thiếu MaRapPhim, MaPhim hoặc NgayChieu");
        }

        const result = await authService.getSuatChieus({
            MaRapPhim,
            MaPhim,
            NgayChieu
        });

        const response = handleSuccessResponse(
            200,
            "Lấy danh sách suất chiếu thành công",
            result
        );

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

    /**
 * @swagger
 * /auth/search:
 *   get:
 *     summary: Tìm kiếm phim
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaPhim:
 *                     type: integer
 *                   TenPhim:
 *                     type: string
 *                   ThoiLuong:
 *                     type: integer
 *                   TheLoai:
 *                     type: string
 *                   Anh:
 *                     type: string
 *       400:
 *         description: Thiếu từ khóa tìm kiếm
 *       500:
 *         description: Lỗi server
 */

    async searchPhim(req, res, next) {
        try {
            const { keyword } = req.query;
            const result = await authService.searchPhim(keyword);
            res.status(200).json(handleSuccessResponse(200, "Tìm kiếm thành công", result));
        } catch (error) {
            next(error);
        }
    }
/**
 * @swagger
 * /auth/dang-chieu:
 *   get:
 *     summary: Lấy danh sách phim đang chiếu (chỉ gồm mã, tên và ảnh)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Danh sách phim
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaPhim:
 *                     type: string
 *                   TenPhim:
 *                     type: string
 *                   Anh:
 *                     type: string
 */
async getNowShowingPhims(req, res, next) {
    try {
        const phims = await authService.getNowShowingPhims();
        const response = handleSuccessResponse(200, "Danh sách phim đang chiếu", phims);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
/**
 * @swagger
 * /auth/sorted-by-rating:
 *   get:
 *     tags: [Auth]
 *     summary: Lấy danh sách phim được sắp xếp theo rating
 *     description: Sắp xếp phim theo điểm trung bình DiemSo (bảng danh_gia)
 *     responses:
 *       200:
 *         description: Thành công
 */
async getPhimsSortedByRating(req, res, next) {
    try {
        const data = await authService.getPhimsSortedByRating();
        res.status(200).json({
            code: 200,
            message: "Lấy danh sách phim theo rating thành công",
            data
        });
    } catch (error) {
        next(error);
    }
}


// controllers/authController.js

/**
 * @swagger
 * /auth/filter:
 *   get:
 *     tags: [Auth]
 *     summary: Lọc phim theo tên + thể loại + năm (gọi stored procedure)
 *     parameters:
 *       - in: query
 *         name: TenPhim
 *         schema:
 *           type: string
 *       - in: query
 *         name: TheLoai
 *         schema:
 *           type: string
 *       - in: query
 *         name: Nam
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách phim đã lọc
 */
async filterPhims(req, res, next) {
    try {
        const { TenPhim, TheLoai, Nam } = req.query;

        const data = await authService.filterPhims({
            tenPhim: TenPhim || null,
            theLoai: TheLoai || null,
            nam: Nam ? Number(Nam) : null
        });

        res.status(200).json({
            code: 200,
            message: "Lọc phim thành công",
            data
        });
    } catch (error) {
        next(error);
    }
}

}

export default new AuthController();