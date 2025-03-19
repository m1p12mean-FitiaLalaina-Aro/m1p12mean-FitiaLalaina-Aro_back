const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { updateRolePermissions } = require("../controllers/roleController");

const router = express.Router();

router.put("/update-role-permissions", authMiddleware, adminMiddleware, updateRolePermissions);

module.exports = router;
    