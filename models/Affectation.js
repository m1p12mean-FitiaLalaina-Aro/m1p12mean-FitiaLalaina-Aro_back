const mongoose = require("mongoose");

const affectationSchema = new mongoose.Schema({
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "UserCart", required: true },
  offre: { type: mongoose.Schema.Types.ObjectId, ref: "Offre", required: true },
  mecanicien: { type: mongoose.Schema.Types.ObjectId, ref: "Mecanicien", required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rendezVous: { type: Date, required: true },
  statut: {
    type: String,
    enum: ["en attente", "en cours", "terminée"],
    default: "en attente"
  }
}, { timestamps: true });

const Affectation = mongoose.model("Affectation", affectationSchema);
module.exports = Affectation;
