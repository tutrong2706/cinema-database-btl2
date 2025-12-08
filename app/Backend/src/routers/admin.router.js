import express from "express";
import adminController from "../controllers/admin.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken);

adminRouter.get('/phims', adminController.getPhims);
adminRouter.post('/phims', adminController.createPhim);
adminRouter.put('/phims/:id', adminController.updatePhim);
adminRouter.delete('/phims/:id', adminController.deletePhim);
adminRouter.get('/revenue-report', adminController.revenueReport);

export default adminRouter;