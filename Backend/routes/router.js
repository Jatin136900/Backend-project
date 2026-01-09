import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../controllers/controller.js";
import couponRoutes from "./Coupon.js";



const router = Router();

/* FILE UPLOAD */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, req.body.slug + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.get("/", getData);
router.post("/", upload.single("image"), addData);
router.put("/:id", updateData);
router.delete("/:id", deleteData);

/* COUPON ROUTES */
router.use("/coupon", couponRoutes);
////


export default router;
