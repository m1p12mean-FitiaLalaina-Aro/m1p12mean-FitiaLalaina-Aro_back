const express = require("express");
const router = express.Router();
const { createOffre, getAllOffres, getOffresParCartClient } = require("../controllers/offreController");
const { authMiddleware, checkPermission } = require("../middleware/auth");

router.post("/", authMiddleware, checkPermission("create_offre"),createOffre); 
router.get("/", authMiddleware,getAllOffres); 
router.get("/userCart/:cartId", authMiddleware,getOffresParCartClient); 

module.exports = router;
