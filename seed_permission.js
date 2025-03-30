const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Permission = require("./models/Permission");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedDatabase = async () => {
  try {
    await Permission.deleteMany({});

    // Ajouter les permissions disponibles
    await Permission.insertMany([
      { name: "create_mecanicien" },
    ]);

    console.log("🚀 Permissions insérées avec succès !");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion :", error);
    process.exit(1);
  }
};

seedDatabase();
