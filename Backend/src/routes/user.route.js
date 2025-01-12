import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// verify
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/getUser").get(verifyJWT, getCurrentUser);
router.route("/updateUser").patch(verifyJWT, updateUser);

export default router;
