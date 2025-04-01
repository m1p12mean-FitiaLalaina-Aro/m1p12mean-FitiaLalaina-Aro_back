const express = require("express");
const router = express.Router();
const {
  createUserCart,
  getUserCarts,
  getUserCartById,
  updateUserCart,
  deleteUserCart,
  choisirOffreClient
} = require("../controllers/userCartController");
const { authMiddleware, checkPermission } = require("../middleware/auth");

// CRUD routes protégées par authentification
router.post("/", authMiddleware,checkPermission("create_cart"), createUserCart);
router.get("/", authMiddleware, getUserCarts);
router.get("/:id", authMiddleware, getUserCartById);
router.delete("/:id", authMiddleware, deleteUserCart);
router.put("/choisir-offre", authMiddleware,checkPermission("create_cart"), choisirOffreClient);

module.exports = router;
