const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Permission = require("../models/Permission");
const RolePermission = require("../models/RolePermission");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const initializeRolesAndPermissions = async () => {
  try {
    await RolePermission.deleteMany();

    // Créer les rôles avec permissions vides
    const roles = ["user", "manager", "mecanicien"];
    for (const role of roles) {
      await RolePermission.create({ role, permissions: [] });
      console.log(`✅ Rôle '${role}' ajouté`);       
    }

    // Ajouter des permissions au rôle manager
    await assignPermissions("user", ["create_cart"]);
    await assignPermissions("manager", ["create_mecanicien","create_offre"]);
    await assignPermissions("mecanicien", ["get_tache"]);

    console.log("🚀 Rôles et permissions configurés avec succès !");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Erreur :", error.message);
    mongoose.disconnect();
  }
};

// Fonction pour assigner des permissions à un rôle
const assignPermissions = async (roleName, permissionNames) => {
  const role = await RolePermission.findOne({ role: roleName });
  if (!role) return console.log(`⚠️ Rôle '${roleName}' introuvable.`);

  const permissionIds = [];

  for (const name of permissionNames) {
    let permission = await Permission.findOne({ name });
    if (!permission) {
      permission = await Permission.create({ name });
      console.log(`🔧 Permission '${name}' créée`);
    }
    permissionIds.push(permission._id);
  }

  role.permissions = permissionIds;
  await role.save();
  console.log(`🔐 Permissions ajoutées au rôle '${roleName}'`);
};

initializeRolesAndPermissions();
