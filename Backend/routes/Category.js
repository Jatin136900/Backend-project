import express from "express";
import { createCategory, getCategories } from "../controllers/Category.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);

export default router;
