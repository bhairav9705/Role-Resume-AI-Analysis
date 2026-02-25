import { Router } from "express";
import passport from "passport";
import {
  checkEmail,
  signup,
  login,
  getMe,
  logout,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/check-email", checkEmail);
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", getMe);
router.post("/logout", logout);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.cookie("token", req.user.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    res.redirect("http://localhost:5000/dashboard");
  },
);

export default router;
