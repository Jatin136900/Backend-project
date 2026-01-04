import { Router } from "express";
import { loginAdmin, logoutAdmin, updateAdmin, } from "../controllers/Admin.js";
import { checkAdmin } from "../middlewares/middleAuth.js";

const authAdmin = Router();

authAdmin.post("/login", loginAdmin);
authAdmin.post("/logout", logoutAdmin);
authAdmin.put("/:id", updateAdmin);
authAdmin.get("/check", checkAdmin);



export default authAdmin;
