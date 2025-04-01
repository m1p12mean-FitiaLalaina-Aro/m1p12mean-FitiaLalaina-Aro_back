const mongoose = require("mongoose");

const mecanicienSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  specialites: { type: [String], required: true },
  disponible: { type: Boolean, default: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // lien vers le manager
  garage: { type: String } // optionnel si tu veux préciser le garage
}, { timestamps: true });

const Mecanicien = mongoose.model("Mecanicien", mecanicienSchema);
module.exports = Mecanicien;
