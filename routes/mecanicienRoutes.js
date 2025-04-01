const express = require("express");
const router = express.Router();
const { authMiddleware, checkPermission } = require("../middleware/auth");
const { creerFicheMecanicien, getAllFichesMecaniciens, getBySpecialite, ajouterSpecialites } = require("../controllers/mecanicienController");

router.post("/", authMiddleware,checkPermission("create_mecanicien"), creerFicheMecanicien);
router.get("/", authMiddleware,getAllFichesMecaniciens);
router.get("/specialite/:nom", authMiddleware, getBySpecialite);
router.put("/ajouter-specialites", authMiddleware,checkPermission("create_mecanicien"),ajouterSpecialites);

module.exports = router;
