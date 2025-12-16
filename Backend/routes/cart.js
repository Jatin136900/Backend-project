import { Router } from "express";
import { checkAuth } from "../middlewares/middleAuth.js";
import { addtoCart } from "../controllers/cart.js";


const cartRouter = Router();

cartRouter.post('/add', checkAuth, addtoCart);

export default cartRouter;