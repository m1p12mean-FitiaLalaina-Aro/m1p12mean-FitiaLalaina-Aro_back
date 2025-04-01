const express = require("express");
const { authMiddleware, checkPermission } = require("../middleware/auth");
const { attribuerMecaniciens } = require("../controllers/affectationController");
const router = express.Router();

router.post("/attribuer", authMiddleware,checkPermission("create_mecanicien"),attribuerMecaniciens);
module.exports = router;