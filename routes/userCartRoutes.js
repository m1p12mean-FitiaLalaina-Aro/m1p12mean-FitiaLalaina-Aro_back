const express = require("express");
const router = express.Router();
const {
  createUserCart,
  getUserCarts,
  getUserCartById,
  updateUserCart,
  deleteUserCart
} = require("../controllers/userCartController");
const { authMiddleware, checkPermission } = require("../middleware/auth");

// CRUD routes protégées par authentification
router.post("/", authMiddleware,checkPermission("create_cart"), createUserCart);
router.get("/", authMiddleware, getUserCarts);
router.get("/:id", authMiddleware, getUserCartById);
router.put("/:id", authMiddleware, updateUserCart);
router.delete("/:id", authMiddleware, deleteUserCart);

module.exports = router;
