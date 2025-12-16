import { Router } from "express";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";          // ✅ ADD
import Product from "../models/models.js"; // ✅ SAME
import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    checkSlug
} from "../controllers/product.js";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const finalName =
            (req.body.slug || Date.now()) + path.extname(file.originalname);
        cb(null, finalName);
    },
});

const upload = multer({ storage });

/* ===== EXISTING (NO CHANGE) ===== */
router.get("/", getProducts);
router.post("/", upload.single("image"), addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/checkSlug/:slug", checkSlug);

/* ===== SINGLE PRODUCT ROUTE (FIXED & SAFE) ===== */
router.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        let product = null;

        // 1️⃣ Pehle slug se find karo
        product = await Product.findOne({ slug });

        // 2️⃣ Agar slug se nahi mila & valid ObjectId ho
        if (!product && mongoose.Types.ObjectId.isValid(slug)) {
            product = await Product.findById(slug);
        }

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
