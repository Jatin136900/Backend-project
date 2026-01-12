import express from "express";
import { getRelatedProducts } from "../controllers/iController.js";

const router = express.Router();

router.post("/related-products", getRelatedProducts);


export default router;
