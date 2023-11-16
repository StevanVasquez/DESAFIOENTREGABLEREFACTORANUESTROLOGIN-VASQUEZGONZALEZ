import { Router } from "express";
import authMiddl from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", async (req, res) => {
  res.redirect("/login");
});
router.get("/login", async (req, res) => {
  res.render("login", { style: "styles.css" });
});
router.get("/register", async (req, res) => {
  res.render("register", { style: "styles.css" });
});
router.get("/recover", async (req, res) => {
  res.render("recover", { style: "styles.css" });
});
router.get("/profile", authMiddl, async (req, res) => {
  const user = req.session.user;
  res.status(200).render("profile", { style: "styles.css", user });
});
router.get("/admin", authMiddl, async (req, res) => {
  const user = req.session.user;
  res.status(200).render("admin", { style: "styles.css", user });
});
export default router;