import express from "express";
import { addCoupon, applyCoupon } from "../controllers/Coupon.js";

const router = express.Router();

router.post("/add", addCoupon);
router.post("/apply", applyCoupon);

export default router;