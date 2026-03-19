import express from "express";
import { getRelatedProducts } from "../controllers/iController.js";
import { checkAuth } from "../middlewares/middleAuth.js";

const router = express.Router();

router.post("/related-products", checkAuth, getRelatedProducts);


export default router;
