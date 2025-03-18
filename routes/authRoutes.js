const express = require("express");
const { check } = require("express-validator");
const { register, login } = require("../controllers/authcontroller");

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

// 🔹 Route de connexion
router.post("/login", login);

module.exports = router;
