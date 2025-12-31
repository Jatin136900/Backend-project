import Coupon from "../models/Coupon.js";

/* ======================
   ADMIN: ADD COUPON
====================== */
export const addCoupon = async (req, res) => {
  try {
    const { code, discount, startDate, expiryDate } = req.body;

    if (!code || !discount || !startDate || !expiryDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (new Date(startDate) >= new Date(expiryDate)) {
      return res.status(400).json({
        message: "Expiry date must be after start date",
      });
    }

    const existingCoupon = await Coupon.findOne({ code });

    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      code,
      discount,
      startDate,
      expiryDate,
    });

    res.status(201).json({
      message: "Coupon added successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   USER: APPLY COUPON
====================== */
export const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code || !cartTotal) {
      return res
        .status(400)
        .json({ message: "Coupon code and cart total required" });
    }

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon" });
    }

    const now = new Date();

    // ⛔ Coupon not started yet
    if (now < new Date(coupon.startDate)) {
      return res.status(400).json({ message: "Coupon not active yet" });
    }

    // ⛔ Coupon expired
    if (now > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    const discountAmount = (cartTotal * coupon.discount) / 100;
    const finalPrice = cartTotal - discountAmount;

    res.status(200).json({
      message: "Coupon applied successfully",
      discountPercentage: coupon.discount,
      discountAmount,
      finalPrice,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};