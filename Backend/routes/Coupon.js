import express from "express";
import {
  addCoupon,
  applyCoupon,
  getCoupons,
  deleteCoupon,
} from "../controllers/Coupon.js";

const router = express.Router();

router.post("/add", addCoupon);
router.post("/apply", applyCoupon);
router.get("/", getCoupons);
router.delete("/:id", deleteCoupon);

export default router;
