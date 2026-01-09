import Product from "../models/models.js";

export const getRelatedProducts = async (req, res) => {
  try {
    const { category, productId } = req.body;

    // 🔥 SIMPLE + RELIABLE LOGIC
    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      category: category,
    })
      .limit(4)
      .sort({ createdAt: -1 });

    res.json(relatedProducts);
  } catch (err) {
    console.error("Related product error:", err);
    res.status(500).json({ message: "Failed to load related products" });
  }
};
