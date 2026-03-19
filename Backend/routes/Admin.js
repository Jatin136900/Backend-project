import { Router } from "express";
import {
  deleteUser,
  getAdminUsers,
  loginAdmin,
  logoutAdmin,
  toggleBlockUser,
} from "../controllers/Admin.js";
import { checkAdmin } from "../middlewares/middleAuth.js";

const router = Router();

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/check", checkAdmin, (req, res) => {
  res.status(200).json({ message: "Admin verified" });
});

router.get("/users", checkAdmin, getAdminUsers);
router.delete("/users/:id", checkAdmin, deleteUser);
router.patch("/users/:id/block", checkAdmin, toggleBlockUser);

// Legacy route kept for compatibility with existing clients.
router.patch("/user/block/:id", checkAdmin, toggleBlockUser);

export default router;
