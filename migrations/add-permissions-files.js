// migrations/add-specialite-field.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User"); 

dotenv.config();
const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Permission.deleteMany({});
  await Permission.insertMany([
    { name: "create_mecanicien" },
  ]);

  console.log("Mise à jour :", result);
  mongoose.disconnect();
};

run();
