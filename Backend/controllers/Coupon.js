import Coupon from "../models/Coupon.js";

/* ======================
   ADD COUPON
====================== */
export const addCoupon = async (req, res) => {
  try {
    const { code, discount, startDate, expiryDate } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(startDate) < today) {
      return res.status(400).json({ message: "Start date cannot be in past" });
    }

    if (new Date(expiryDate) <= new Date(startDate)) {
      return res
        .status(400)
        .json({ message: "Expiry must be after start date" });
    }

    const exists = await Coupon.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      code,
      discount,
      startDate,
      expiryDate,
    });

    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   GET COUPONS
====================== */
export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
};

/* ======================
   DELETE COUPON
====================== */
export const deleteCoupon = async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: "Coupon deleted" });
};

/* ======================
   APPLY COUPON
====================== */
export const applyCoupon = async (req, res) => {
  const { code, cartTotal } = req.body;

  const coupon = await Coupon.findOne({ code });
  if (!coupon) {
    return res.status(404).json({ message: "Invalid coupon" });
  }

  const now = new Date();

  if (now < coupon.startDate)
    return res.status(400).json({ message: "Coupon not active yet" });

  if (now > coupon.expiryDate)
    return res.status(400).json({ message: "Coupon expired" });

  const discountAmount = (cartTotal * coupon.discount) / 100;

  res.json({
    discount: coupon.discount,
    discountAmount,
    finalPrice: cartTotal - discountAmount,
  });
};
