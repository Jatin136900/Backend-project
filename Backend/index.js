import express from "express";
// import sum from "./sum.js";
import connectToDB from "./db/connnect.js";
// import router from "./routes/router.js";
import productRouter from "./routes/productRouter.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import adminRoutes from "./routes/Admin.js";
import checkRouter from "./routes/check.js";
import cartRouter from "./routes/cart.js";
import cookieParser from "cookie-parser";
import couponRouter from "./routes/Coupon.js";
import categoryRoutes from "./routes/Category.js";
import aiRoutes from "./routes/aiRoutes.js";

import path from "path";

const app = express();
app.use(express.json());

await connectToDB();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// app.use("/", router)

app.use("/product", productRouter);

app.use("/api/auth", authRoutes);

app.use("/admin", adminRoutes);

app.use("/check", checkRouter);

app.use("/uploads", express.static("uploads"));

app.use("/cart", cartRouter);

app.use("/coupon", couponRouter);

app.use("/category", categoryRoutes);

app.use("/api/ai", aiRoutes);

app.listen(3000, () => console.log("Server started at port 3000"));
