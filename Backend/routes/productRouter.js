import { Router } from "express";
import multer from "multer";
import path from "path";
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
        const finalName = (req.body.slug || Date.now()) + path.extname(file.originalname);
        cb(null, finalName);
    },
});

const upload = multer({ storage });

router.get("/", getProducts);
router.post("/", upload.single("image"), addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get('/checkSlug/:slug',checkSlug)

export default router;
