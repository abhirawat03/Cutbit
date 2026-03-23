import { Router } from "express";
import passport from "passport";
import { googleAuthCallback } from "../controllers/user.js";
import { forgotPassword, resetPassword } from "../controllers/auth.js";

const router = Router();

// start google login
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account"
    })
);

// google callback
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    googleAuthCallback
);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;