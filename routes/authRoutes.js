const express = require("express");
const { check } = require("express-validator");
const { register, login, updatePassword } = require("../controllers/authcontroller");
const { authMiddleware, adminMiddleware, checkPermission } = require("../middleware/auth");

const router = express.Router();

// 🔹 Route d'inscription
router.post(
  "/register",
  [
    check("name", "Le nom est requis").not().isEmpty(),
    check("email", "Veuillez entrer un email valide").isEmail(),
    check("password", "Le mot de passe doit contenir au moins 8 caractères").isLength({ min: 8 })
  ],
  register
);
router.post("/register-mecanicien", authMiddleware, checkPermission("create_mecanicien"), register);


// 🔹 Route de connexion
router.post("/login", login);
router.put("/update-password", authMiddleware, updatePassword);




module.exports = router;
