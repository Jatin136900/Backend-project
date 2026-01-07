import { Router } from "express";
import {
    loginAdmin,
    logoutAdmin,
    toggleBlockUser,
} from "../controllers/Admin.js";
import { checkAdmin } from "../middlewares/middleAuth.js";

const router = Router();

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

/* 🔥 BLOCK / UNBLOCK USER */
router.patch("/user/block/:id", toggleBlockUser);

router.get("/check", checkAdmin);

export default router;
