const express = require("express");
const { updateRolePermissions, ajouterPermissions, ajouterRolePermission } = require("../controllers/roleController");

const router = express.Router();

router.post("/permission", ajouterPermissions);
router.post("/role-permissions", ajouterRolePermission);
router.put("/update-role-permissions", updateRolePermissions);

module.exports = router;
    