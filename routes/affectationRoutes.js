const express = require("express");
const { authMiddleware, checkPermission } = require("../middleware/auth");
const { attribuerMecaniciens, getTachesMecanicien, updateStatut } = require("../controllers/affectationController");
const router = express.Router();

router.post("/attribuer", authMiddleware,checkPermission("create_mecanicien"),attribuerMecaniciens);
router.get("/tacheMecanicien", authMiddleware,checkPermission("get_tache"),getTachesMecanicien);
router.put("/update-status/:affectationId", authMiddleware,checkPermission("get_tache"),updateStatut);

module.exports = router;