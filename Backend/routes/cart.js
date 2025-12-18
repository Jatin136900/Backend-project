import { Router } from "express";
import { checkAuth } from "../middlewares/middleAuth.js";
import { getCart, updateQty, removeItem, addtoCart } from "../controllers/cart.js";

const cartRouter = Router();

cartRouter.get("/", checkAuth, getCart);
cartRouter.patch("/qty", checkAuth, updateQty);
cartRouter.delete("/:productId", checkAuth, removeItem);
cartRouter.post("/add", checkAuth, addtoCart)

export default cartRouter;
