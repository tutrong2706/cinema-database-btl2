import userService from "../services/user.service.js";
import { handleSuccessResponse } from "../helpers/handleResponse.js";

class UserController {
    async getHistory(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await userService.getTransactionHistory(userId);
            const response = handleSuccessResponse(200, "Lấy lịch sử giao dịch thành công", result);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
