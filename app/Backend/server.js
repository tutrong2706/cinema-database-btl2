import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rootRouter from "./src/routers/root.router.js";
import { setupSwagger } from "./src/common/swagger/swagger.config.js";
import { errorHandler } from "./src/helpers/handleError.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3069;

// --- setup swagger ---
setupSwagger(app);

// --- Cấu hình Router ---
app.use(rootRouter);


// --- Middleware error handler ---
app.use(errorHandler);

// --- start server ---
app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}!`);
});

