import { Router } from "express";
import multer from "multer";
import path from "path";
import { getData, addData, updateData, deleteData } from "../controllers/controller.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Folder must exist!
    },
    filename: (req, file, cb) => {
        const fileName = req.body.slug + path.extname(file.originalname);
        cb(null, fileName);
    },
});

const upload = multer({ storage });

const router = Router();

router.get("/", getData);
router.post("/", upload.single("image"), addData);
router.put("/:id", updateData);
router.delete("/:id", deleteData);

export default router;
