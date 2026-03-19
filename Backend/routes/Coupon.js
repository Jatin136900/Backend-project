import express from "express";
import {
  addCoupon,
  applyCoupon,
  getCoupons,
  deleteCoupon,
} from "../controllers/Coupon.js";
import { checkAdmin, checkAuth } from "../middlewares/middleAuth.js";

const router = express.Router();

router.post("/add", checkAdmin, addCoupon);
router.post("/apply", checkAuth, applyCoupon);
router.get("/", checkAdmin, getCoupons);
router.delete("/:id", checkAdmin, deleteCoupon);

export default router;
