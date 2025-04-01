const mongoose = require("mongoose");

const offreSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "UserCart", required: true }
  },
  { timestamps: true }
);

const Offre = mongoose.model("Offre", offreSchema);
module.exports = Offre;
