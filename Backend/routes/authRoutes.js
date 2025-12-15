import { Router } from "express";
import { getUsers, loginUsers, logoutUsers, registerUser, deleteUsers, updateUsers, } from "../controllers/authController.js";


const router = Router();

router.get("/", getUsers);

router.post("/login", loginUsers);

router.post("/logout", logoutUsers);

router.post("/register", registerUser);

router.delete("/:id", deleteUsers);    

router.put("/:id", updateUsers);

export default router;








