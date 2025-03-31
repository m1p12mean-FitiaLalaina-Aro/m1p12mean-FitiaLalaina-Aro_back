const express = require("express");
const router = express.Router();
const { createOffre, getAllOffres } = require("../controllers/offreController");
const { authMiddleware, checkPermission } = require("../middleware/auth");

router.post("/", authMiddleware, checkPermission("create_offre"),createOffre); 
router.get("/", authMiddleware,getAllOffres); 

module.exports = router;
