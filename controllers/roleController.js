const RolePermission = require("../models/RolePermission");
const Permission = require("../models/Permission");

// 🔹 Modifier les permissions d'un rôle
exports.updateRolePermissions = async (req, res) => {
  try {
    const { role, permissions } = req.body;
    const validPermissions = await Permission.find({ name: { $in: permissions } });
    if (validPermissions.length !== permissions.length) {
      return res.status(400).json({ msg: "Une ou plusieurs permissions sont invalides" });
    }

    // Mettre à jour les permissions du rôle
    await RolePermission.findOneAndUpdate(
      { role },
      { permissions: validPermissions.map((p) => p._id) },
      { new: true }
    );

    res.json({ msg: `Permissions du rôle '${role}' mises à jour avec succès !` });
  } catch (error) {
    console.error("Erreur lors de la modification des permissions :", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};
