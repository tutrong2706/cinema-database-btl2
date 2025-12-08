import express from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/history", authMiddleware, userController.getHistory);

export default userRouter;
