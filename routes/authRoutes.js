const express = require("express");
const { check } = require("express-validator");
const { register, login } = require("../controllers/authcontroller");
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

// 🔹 Route de connexion
router.post("/login", login);

// 🔹 Route protégée 
router.get("/profile", authMiddleware, async (req, res) => {
  res.json({ msg: `Bienvenue ${req.user.name}, votre rôle est ${req.user.role}` });
});
router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
    res.json({ msg: "Bienvenue Admin, accès autorisé" });
});

// Gestion de role 
router.post("/create-product", authMiddleware, checkPermission("create_product"), (req, res) => {
    res.json({ msg: "Produit créé avec succès !" });
});
  
router.put("/edit-product", authMiddleware, checkPermission("edit_product"), (req, res) => {
res.json({ msg: "Produit mis à jour !" });
});
  
router.delete("/delete-product", authMiddleware, checkPermission("delete_product"), (req, res) => {
    res.json({ msg: "Produit supprimé !" });
});

module.exports = router;
