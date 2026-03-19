import express from "express";
import { createCategory, getCategories, deleteCategory } from "../controllers/Category.js";
import { checkAdmin } from "../middlewares/middleAuth.js";

const router = express.Router();

router.post("/", checkAdmin, createCategory);
router.get("/", getCategories);
router.delete("/:id", checkAdmin, deleteCategory);

export default router;
