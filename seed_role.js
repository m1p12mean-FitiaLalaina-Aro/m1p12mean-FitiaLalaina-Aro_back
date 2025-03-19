const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Permission = require("./models/Permission");
const RolePermission = require("./models/RolePermission");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedRoles = async () => {
  try {
    await RolePermission.deleteMany({});

    // Récupérer les permissions existantes
    const p1 = await Permission.findOne({ name: "create_product" });
    const p2 = await Permission.findOne({ name: "edit_product" });
    const p3 = await Permission.findOne({ name: "delete_product" });

    // Vérifier que les permissions existent avant d'insérer
    if (!p1 || !p2 || !p3) {
      console.error("❌ Les permissions ne sont pas encore créées ! Exécutez d'abord `seed.js`.");
      process.exit(1);
    }

    // Insérer les permissions des rôles
    await RolePermission.insertMany([
      { role: "user", permissions: [p1._id] },
      { role: "manager", permissions: [p1._id, p2._id, p3._id] }
    ]);

    console.log("🚀 Rôles et permissions initialisés !");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion :", error);
    process.exit(1);
  }
};

seedRoles();
