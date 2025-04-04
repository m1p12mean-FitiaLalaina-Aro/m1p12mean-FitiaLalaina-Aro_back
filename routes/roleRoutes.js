const express = require("express");
const { updateRolePermissions, ajouterPermissions } = require("../controllers/roleController");

const router = express.Router();

router.post("/permission", ajouterPermissions);
router.put("/update-role-permissions", updateRolePermissions);

module.exports = router;
    