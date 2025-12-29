import express from "express";
// import sum from "./sum.js";
import connectToDB from "./db/connnect.js";
// import router from "./routes/router.js";
import productRouter from "./routes/productRouter.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors"
import adminRoutes from './routes/Admin.js'
import checkRouter from "./routes/check.js";
import cartRouter from "./routes/cart.js";
import cookieParser from "cookie-parser";




const app = express();
app.use(express.json());

await connectToDB();






app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.VITE_FRONTEND_URL
    ],
    credentials: true,
  })
);


app.use(cookieParser());

// app.use("/", router)

app.use("/product", productRouter);

app.use("/api/auth", authRoutes);

app.use("/admin", adminRoutes)

app.use("/check", checkRouter)

app.use("/uploads", express.static("uploads"));

app.use('/cart', cartRouter)



app.listen(3000, () => console.log("Server started at port 3000"));
