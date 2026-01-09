import { Router } from "express";
import { getUsers, loginUsers, logoutUsers, registerUser, deleteUsers, updateUsers, sendLoginOTP, verifyLoginOTP, } from "../controllers/authController.js";
import { googleLogin } from "../controllers/GoogleLogin.js";
import { githubLogin } from "../controllers/authController.js";



const router = Router();

router.get("/user", getUsers);

router.post("/login", loginUsers);

router.post("/logout", logoutUsers);

router.post("/register", registerUser);

router.delete("/:id", deleteUsers);

router.put("/:id", updateUsers);

router.post("/googleLogin", googleLogin)

router.post("/github-login", githubLogin);

router.post("/send-login-otp", sendLoginOTP);

router.post("/verify-login-otp", verifyLoginOTP);


// router.get("/check/login", checkLogin);

export default router;








