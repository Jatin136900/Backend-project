import { Router } from "express";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import Product from "../models/models.js";
import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    checkSlug
} from "../controllers/product.js";
import { checkAdmin } from "../middlewares/middleAuth.js";

const router = Router();

/* ================= MULTER CONFIG ================= */
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

/* ================= PUBLIC ROUTES ================= */
router.get("/", getProducts);
router.get("/checkSlug/:slug", checkSlug);

/* ================= ADMIN ROUTES ================= */
router.post("/", checkAdmin, upload.single("image"), addProduct);
router.put("/:id", checkAdmin, upload.single("image"), updateProduct);
router.delete("/:id", checkAdmin, deleteProduct);

/* ================= SINGLE PRODUCT (slug / id) ================= */
router.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        let product = await Product.findOne({ slug });

        if (!product && mongoose.Types.ObjectId.isValid(slug)) {
            product = await Product.findById(slug);
        }

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
