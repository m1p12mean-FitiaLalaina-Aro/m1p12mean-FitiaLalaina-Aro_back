const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Permission = require("./models/Permission");
const RolePermission = require("./models/RolePermission");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedRoles = async () => {
  try {
    await RolePermission.deleteMany({});
    await new RolePermission({
      role: "user",
      permissions: [] 
    }).save();

    await new RolePermission({
      role: "manager",
      permissions: [] 
    }).save();

    await new RolePermission({
      role: "mecanicien",
      permissions: [] 
    }).save();

    console.log("🚀 Rôles et permissions initialisés !");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion :", error);
    process.exit(1);
  }
};

seedRoles();
