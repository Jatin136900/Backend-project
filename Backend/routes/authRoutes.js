import { Router } from "express";
import {
  githubLogin,
  loginUsers,
  logoutUsers,
  registerUser,
} from "../controllers/authController.js";
import { googleLogin } from "../controllers/GoogleLogin.js";
 

const router = Router();

router.post("/login", loginUsers);

router.post("/logout", logoutUsers);

router.post("/register", registerUser);
router.post("/googleLogin", googleLogin);
router.post("/github-login", githubLogin);

export default router;








