import { Router } from "express";
import passport from "passport";
import userModel from "../dao/models/user.model.js";
import productsModel from "../dao/models/products.model.js";
import { createHashValue, isValidPwd } from "../encrypt/encrypt.js";

const router = Router();
router.post("/register", async (req, res) => {
    try {
      const { first_name, last_name, email, age, password } = req.body;
      const pwdHashed = await createHashValue(password);
      const addedUser = { first_name, last_name, email, age, password: pwdHashed };

      const checkUser = await userModel.findOne({ email: email });

      if (checkUser) {
        return res.redirect("/login");
      } else {
        const newUser = await userModel.create(addedUser);
        req.session.user = { ...addedUser };
        console.log(newUser);
        return res.redirect("/login");
      }
    } catch (err) {
      console.log(err);
    }
});
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = { first_name: "Admin CODERHOUSE", age: "-", email: "adminCoderhouse@coder.com", password: "adminCod3r123@**", role: "admin" };
      if (email !== admin.email || password !== admin.password) {
        const findUser = await userModel.findOne({ email });
        if (!findUser) {
          return res.status(401).redirect("/register");
        }
        const isValidComparePwd = await isValidPwd(password, findUser.password);
        if (!isValidComparePwd) {
          return res.status(401).redirect("/login");
        }
        req.session.user = {
          ...findUser,
        };
        const { docs } = await productsModel.paginate({}, { lean: true });
        return res.render("profile", { style: "styles.css", first_name: req.session?.user?.first_name || findUser.first_name, email: req.session?.user?.email || email,
        age: req.session?.user?.age || findUser.age, role: req.session?.user?.role || findUser.role, products: docs });
      } else {
        const { docs } = await productsModel.paginate({}, { lean: true });
        res.render("admin", { style: "styles.css", first_name: admin.first_name, age: admin.age, email: req.session?.user?.email || email, role: admin.role, products: docs });
      }
    } catch (err) {
      console.log(err);
    }
});
router.get("/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (!err) return res.redirect("/login");
      return res.send({ message: "Logout error", body: err });
    });
});
router.get("/github", passport.authenticate("github", { scope: ["user: email"] }), async (req, res) => {});
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    try {
      req.session.user = req.user;
      console.log(req.session.user);
      const { docs } = await productsModel.paginate({}, { lean: true });
      res.render("profile", { style: "styles.css", first_name: req.session?.user?.first_name, last_name: req.session?.user?.last_name,
      email: req.session?.user?.email, age: req.session?.user?.age, role: req.session?.user?.role, products: docs });
    } catch (err) {
      console.log(err);
    }
  }
);
export default router;