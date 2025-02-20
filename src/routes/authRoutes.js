import express from "express";
import {
    registerUser,
    loginUser,
    googleLoginUser,
    facebookLoginUser,
    getLoggedUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLoginUser);
router.post("/facebook-login", facebookLoginUser);
router.get("/profile", getLoggedUser);

export default router;
