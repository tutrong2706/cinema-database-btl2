import adminService from "../services/admin.service.js";
import { handleSuccessResponse } from "../helpers/handleResponse.js";

class AdminController {
    
    async getPhims(req, res, next) {
        try {
            const { keyword } = req.query;
            // service method is `getPhims` (calls stored procedure)
            const result = await adminService.getPhims(keyword);
            res.status(200).json(handleSuccessResponse(200, "Lấy danh sách thành công", result));
        } catch (error) {
            next(error);
        }
    }

    // --- Đảm bảo hàm này tồn tại ---
    async createPhim(req, res, next) {
        try {
            const result = await adminService.createPhim(req.body);
            res.status(201).json(handleSuccessResponse(201, "Thêm thành công", result));
        } catch (error) {
            next(error);
        }
    }

    async updatePhim(req, res, next) {
        try {
            const { id } = req.params;
            const result = await adminService.updatePhim(id, req.body);
            res.status(200).json(handleSuccessResponse(200, "Cập nhật thành công", result));
        } catch (error) {
            next(error);
        }
    }

    async deletePhim(req, res, next) {
        try {
            const { id } = req.params;
            const result = await adminService.deletePhim(id);
            res.status(200).json(handleSuccessResponse(200, "Xóa thành công", result));
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminController();