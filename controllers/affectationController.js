const Affectation = require("../models/Affectation");
const UserCart = require("../models/UserCart");
const Mecanicien = require("../models/Mecanicien");

exports.attribuerMecaniciens = async (req, res) => {
  try {
    const { cartId, offreId, mecanicienIds } = req.body;

    // Vérifie que la UserCart existe
    const cart = await UserCart.findById(cartId);
    if (!cart) return res.status(404).json({ msg: "Demande introuvable" });

    // Vérifie que le client a bien validé l'offre
    if (!cart.offreChoisie || cart.offreChoisie.toString() !== offreId) {
      return res.status(400).json({ msg: "Offre non validée par le client." });
    }

    const rendezVous = cart.dateHeureReparation;
    if (!rendezVous) {
      return res.status(400).json({ msg: "Date de rendez-vous non définie par le client." });
    }

    const affectations = [];

    for (const mecanicienId of mecanicienIds) {
      const mecanicien = await Mecanicien.findById(mecanicienId);
      if (!mecanicien || !mecanicien.disponible) {
        continue; // Ignore si indisponible
      }

      // Créer une affectation
      const affectation = await Affectation.create({
        cart: cartId,
        offre: offreId,
        manager: req.user._id,
        mecanicien: mecanicienId,
        rendezVous
      });

      // Marquer comme indisponible
      mecanicien.disponible = false;
      await mecanicien.save();

      affectations.push(affectation);
    }

    res.status(201).json({
      msg: "Affectation(s) enregistrée(s)",
      totalAffectés: affectations.length,
      affectations
    });
  } catch (error) {
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};
